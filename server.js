import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import fs from 'fs';

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
    console.log("Firebase Admin Initialized successfully.");
  } else {
    console.warn("WARNING: No Firebase credentials found! API will return 500 errors until configured.");
  }
} catch (e) {
  console.error("Firebase Admin Error:", e);
}

const app = express();
app.use(cors());
app.use(express.json());

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

// Export for Vercel
export default app;

// Local Development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
