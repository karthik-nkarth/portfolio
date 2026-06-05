import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import bcrypt from 'bcrypt';

dotenv.config();

let db;
try {
  let serviceAccount;
  if (fs.existsSync('./firebase-service-account.json')) {
    serviceAccount = JSON.parse(fs.readFileSync('./firebase-service-account.json', 'utf8'));
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }
  
  if (serviceAccount) {
    initializeApp({ credential: cert(serviceAccount) });
    db = getFirestore();
    db.settings({ preferRest: true });
    console.log("Firebase Admin Initialized successfully.");
  } else {
    console.warn("WARNING: No Firebase credentials found! API will return 500 errors until configured.");
  }
} catch (e) {
  console.error("Firebase Admin Error:", e);
}

const app = express();

const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'karthik.hamsanarayanan@gmail.com',
    pass: process.env.EMAIL_PASS
  },
  tls: { rejectUnauthorized: false }
});

// Submit Review Endpoint
app.post('/api/submit-review', async (req, res) => {
  try {
    const { firstName, lastName, designation, company, review, imageUrl } = req.body;

    if (!firstName || !lastName || !designation || !company || !review || !imageUrl) {
      return res.status(400).json({ error: 'All fields are mandatory, including the image.' });
    }

    if (review.length < 200) {
      return res.status(400).json({ error: 'Review must be at least 200 characters.' });
    }

    if (!db) return res.status(500).json({ error: 'Firebase Database not configured.' });

    const reviewId = uuidv4();
    const newReview = {
      id: reviewId,
      name: `${firstName} ${lastName}`,
      role: `${designation}, ${company}`,
      quote: review.length > 80 ? review.substring(0, 80) + '...' : review,
      full: review,
      imagePath: imageUrl,
      status: 'pending',
      date: new Date().toISOString()
    };

    // Save to Firestore
    await db.collection('reviews').doc(reviewId).set(newReview);

    // Send Approval Email
    const host = req.get('host');
    const protocol = req.protocol || 'http';
    const baseUrl = host.includes('localhost') ? 'http://localhost:3001' : `https://${host}`;

    const approveUrl = `${baseUrl}/api/approve-review?id=${reviewId}`;
    const ignoreUrl = `${baseUrl}/api/ignore-review?id=${reviewId}`;

    const mailOptions = {
      from: 'karthik.hamsanarayanan@gmail.com',
      to: 'karthik.hamsanarayanan@gmail.com',
      subject: `New Client Review Submitted by ${firstName} ${lastName}`,
      html: `
        <h2>New Review Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Role:</strong> ${designation}, ${company}</p>
        <p><strong>Review:</strong><br/>${review}</p>
        <p><strong>Image URL:</strong> <a href="${imageUrl}">View Image</a></p>
        <hr/>
        <p>Do you want to publish this review on your website?</p>
        <a href="${approveUrl}" style="padding:10px 20px; background:green; color:white; text-decoration:none; border-radius:5px; margin-right:10px;">Accept & Publish</a>
        <a href="${ignoreUrl}" style="padding:10px 20px; background:red; color:white; text-decoration:none; border-radius:5px;">Ignore</a>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Review submitted successfully.' });

  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// Approve Review
app.get('/api/approve-review', async (req, res) => {
  try {
    const { id } = req.query;
    if (!db) return res.status(500).send('<h1>Database not configured</h1>');

    const reviewRef = db.collection('reviews').doc(id);
    const doc = await reviewRef.get();
    
    if (!doc.exists) {
      return res.status(404).send('<h1 style="font-family:sans-serif; text-align:center; padding:50px;">Review not found.</h1>');
    }

    await reviewRef.update({ status: 'accepted' });
    res.send('<div style="font-family:sans-serif; text-align:center; padding:50px;"><h1 style="color:green;">Review Accepted & Published!</h1><p>The review is now live on your portfolio.</p></div>');
  } catch (e) {
    res.status(500).send('<h1>Error approving review</h1>');
  }
});

// Ignore Review
app.get('/api/ignore-review', async (req, res) => {
  try {
    const { id } = req.query;
    if (!db) return res.status(500).send('<h1>Database not configured</h1>');

    const reviewRef = db.collection('reviews').doc(id);
    const doc = await reviewRef.get();
    
    if (!doc.exists) {
      return res.status(404).send('<h1 style="font-family:sans-serif; text-align:center; padding:50px;">Review not found.</h1>');
    }

    await reviewRef.update({ status: 'ignored' });
    res.send('<div style="font-family:sans-serif; text-align:center; padding:50px;"><h1 style="color:red;">Review Ignored.</h1><p>It has been rejected and will not appear on the website.</p></div>');
  } catch (e) {
    res.status(500).send('<h1>Error ignoring review</h1>');
  }
});

// Get Public Reviews
app.get('/api/reviews', async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not configured' });

    const snapshot = await db.collection('reviews').where('status', '==', 'accepted').get();
    const publicReviews = [];
    snapshot.forEach(doc => {
      publicReviews.push(doc.data());
    });
    
    res.json(publicReviews);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Existing Contact Form endpoint
app.post('/api/send-email', async (req, res) => {
  const { name, email, subject, message } = req.body;
  const mailOptions = {
    from: 'karthik.hamsanarayanan@gmail.com',
    to: 'karthik.hamsanarayanan@gmail.com',
    subject: `Portfolio Contact: ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`
  };
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

// ==========================================
// ADMIN PORTAL ROUTES
// ==========================================

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'password';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_super_secret';

// Middleware to verify Admin JWT
const verifyAdmin = (req, res, next) => {
  const token = req.cookies.admin_token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username !== ADMIN_USER) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    const authRef = db.collection('settings').doc('auth');
    const authDoc = await authRef.get();
    
    let isValid = false;
    
    if (authDoc.exists && authDoc.data().passwordHash) {
      isValid = await bcrypt.compare(password, authDoc.data().passwordHash);
    } else {
      if (password === ADMIN_PASS) {
        isValid = true;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        await authRef.set({ passwordHash: hash }, { merge: true });
      }
    }
    
    if (isValid) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '8h' });
      res.cookie('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 8 * 60 * 60 * 1000 // 8 hours
      });
      res.json({ success: true });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login error' });
  }
});

app.post('/api/admin/forgot-password', async (req, res) => {
  try {
    const resetToken = jwt.sign({ reset: true }, JWT_SECRET, { expiresIn: '15m' });
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      }
    });
    
    const resetUrl = `http://localhost:5173/admin/reset-password?token=${resetToken}`;
    
    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
      await transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: 'karthik.hamsanarayanan@gmail.com',
        subject: 'Admin Portal Password Reset',
        html: `<h2>Password Reset Request</h2><p>Click the link below to reset your password. It expires in 15 minutes.</p><a href="${resetUrl}">Reset Password</a>`
      });
      console.log('Password reset email sent to karthik.hamsanarayanan@gmail.com');
    } else {
      console.warn(`[WARNING] No SMTP_EMAIL or SMTP_PASSWORD in .env. Here is the reset link: ${resetUrl}`);
    }
    
    res.json({ success: true, message: 'If SMTP is configured, a reset link was sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to send reset email' });
  }
});

app.post('/api/admin/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    jwt.verify(token, JWT_SECRET); // Will throw if invalid/expired
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    await db.collection('settings').doc('auth').set({ passwordHash: hash }, { merge: true });
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});

app.post('/api/admin/change-password', verifyAdmin, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    const authRef = db.collection('settings').doc('auth');
    const authDoc = await authRef.get();
    
    let isOldValid = false;
    if (authDoc.exists && authDoc.data().passwordHash) {
      isOldValid = await bcrypt.compare(oldPassword, authDoc.data().passwordHash);
    } else {
      isOldValid = (oldPassword === ADMIN_PASS);
    }
    
    if (!isOldValid) {
      return res.status(401).json({ error: 'Incorrect old password' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    await authRef.set({ passwordHash: hash }, { merge: true });
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ success: true });
});

app.get('/api/admin/me', verifyAdmin, (req, res) => {
  res.json({ success: true, user: req.admin.username });
});


// Admin CRUD Routes for Customers
app.get('/api/admin/sender-profiles', verifyAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('sender_profiles').orderBy('createdAt', 'desc').get();
    const profiles = [];
    snapshot.forEach(doc => profiles.push({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: profiles });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sender profiles' });
  }
});


app.post('/api/admin/upload', verifyAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl });
});

app.post('/api/admin/sender-profiles', verifyAdmin, async (req, res) => {
  try {
    const data = { ...req.body, createdAt: new Date() };
    const docRef = await db.collection('sender_profiles').add(data);
    res.json({ success: true, id: docRef.id, ...data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create sender profile' });
  }
});

app.put('/api/admin/sender-profiles/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body, updatedAt: new Date() };
    await db.collection('sender_profiles').doc(id).update(data);
    res.json({ success: true, id, ...data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update sender profile' });
  }
});

app.get('/api/admin/customers', verifyAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('customers').orderBy('createdAt', 'desc').get();
    const customers = [];
    snapshot.forEach(doc => customers.push({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

app.post('/api/admin/customers', verifyAdmin, async (req, res) => {
  try {
    const data = { ...req.body, createdAt: new Date() };
    const docRef = await db.collection('customers').add(data);
    res.json({ success: true, id: docRef.id, ...data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

app.put('/api/admin/customers/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body, updatedAt: new Date() };
    await db.collection('customers').doc(id).update(data);
    res.json({ success: true, id, ...data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

app.post('/api/admin/customers', verifyAdmin, async (req, res) => {
  try {
    const data = { ...req.body, createdAt: new Date() };
    const docRef = await db.collection('customers').add(data);
    res.json({ success: true, id: docRef.id, ...data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// Admin CRUD Routes for Invoices

app.get('/api/admin/dashboard', verifyAdmin, async (req, res) => {
  try {
    const invoicesSnap = await db.collection('invoices').get();
    const customersSnap = await db.collection('customers').get();
    let totalRevenueINR = 0;
    
    invoicesSnap.forEach(doc => {
      const inv = doc.data();
      let amount = parseFloat(inv.totalAmount) || 0;
      // Convert to INR if it's USD
      if (inv.currencyCode === 'USD') amount = amount * 83; // approx conversion
      else if (inv.currencyCode === 'EUR') amount = amount * 90;
      totalRevenueINR += amount;
    });

    res.json({
      success: true,
      data: {
        totalInvoices: invoicesSnap.size,
        totalCustomers: customersSnap.size,
        totalRevenueINR: Math.round(totalRevenueINR)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load dashboard stats' });
  }
});

app.get('/api/admin/next-invoice-number', verifyAdmin, async (req, res) => {
  try {
    const counterDoc = await db.collection('settings').doc('invoiceCounter').get();
    let nextNum = 70;
    if (counterDoc.exists && counterDoc.data().lastInvoiceNumber) {
      nextNum = counterDoc.data().lastInvoiceNumber + 1;
    } else {
      const snapshot = await db.collection('invoices').get();
      let maxNum = 0;
      snapshot.forEach(doc => {
        const invNumStr = doc.data().invoiceNumber || '';
        const digits = invNumStr.replace(/\D/g, '');
        if (digits) {
          const num = parseInt(digits, 10);
          if (num > maxNum) maxNum = num;
        }
      });
      if (maxNum > 0) nextNum = maxNum + 1;
    }
    
    const formattedNum = `#INV-${nextNum.toString().padStart(6, '0')}`;
    res.json({ success: true, nextInvoiceNumber: formattedNum });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate next invoice number' });
  }
});

app.get('/api/admin/invoices', verifyAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('invoices').orderBy('createdAt', 'desc').get();
    const invoices = [];
    snapshot.forEach(doc => invoices.push({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

app.delete('/api/admin/invoices/:id', verifyAdmin, async (req, res) => {
  try {
    await db.collection('invoices').doc(req.params.id).delete();
    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

app.get('/api/admin/invoices/:id', verifyAdmin, async (req, res) => {
  try {
    const doc = await db.collection('invoices').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    const data = doc.data();
    
    if (!data.senderProfile) {
      const sendersSnap = await db.collection('sender_profiles').get();
      if (!sendersSnap.empty) {
        let defaultSender = null;
        sendersSnap.forEach(sDoc => {
          const sData = sDoc.data();
          if (!defaultSender) defaultSender = { id: sDoc.id, ...sData };
          if (sData.name && sData.name.toLowerCase().includes('webemporia')) {
            defaultSender = { id: sDoc.id, ...sData };
          }
        });
        if (defaultSender) {
          data.senderProfile = defaultSender;
        }
      }
    }
    
    res.json({ success: true, data: { id: doc.id, ...data } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

app.post('/api/admin/invoices', verifyAdmin, async (req, res) => {
  try {
    const data = { ...req.body, createdAt: new Date() };
    const docRef = await db.collection('invoices').add(data);
    
    if (data.invoiceNumber) {
      const digits = data.invoiceNumber.replace(/\D/g, '');
      if (digits) {
        const num = parseInt(digits, 10);
        const counterRef = db.collection('settings').doc('invoiceCounter');
        
        await db.runTransaction(async (transaction) => {
          const counterDoc = await transaction.get(counterRef);
          if (!counterDoc.exists || counterDoc.data().lastInvoiceNumber < num) {
            transaction.set(counterRef, { lastInvoiceNumber: num }, { merge: true });
          }
        });
      }
    }
    
    res.json({ success: true, id: docRef.id, ...data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// Export for Vercel
export default app;

// Local Development
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, '127.0.0.1', () => console.log(`Server running on port ${PORT}`));
}
