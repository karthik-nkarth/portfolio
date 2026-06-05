import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { Icon } from '@iconify/react';
import html2pdf from 'html2pdf.js';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';

const ViewInvoice = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const invoiceRef = useRef(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${apiUrl}/api/admin/invoices/${id}`, { credentials: 'include' });
        const data = await res.json();
        if (data.success) {
          setInvoice(data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const confirmDelete = () => {
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/api/admin/invoices/${id}`, { 
        method: 'DELETE',
        credentials: 'include' 
      });
      if (res.ok) {
        window.location.href = '/admin/invoices';
      }
    } catch (e) {
      console.error(e);
      alert('Failed to delete invoice');
    }
  };

  const handleDownloadPDF = () => {
    if (!invoice) return;
    const element = invoiceRef.current;
    
    // Temporarily make it look exact for printing
    const originalStyle = element.getAttribute('style');
    element.style.transform = 'scale(1)';
    element.style.width = '800px';

    const opt = {
      margin: 0,
      filename: `${invoice.invoiceNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, windowWidth: 800 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: 'css', selector: '.page-break' }
    };
    
    html2pdf().from(element).set(opt).save().then(() => {
      element.setAttribute('style', originalStyle || '');
    });
  };

  if (loading) return <div className="text-white">Loading...</div>;
  if (!invoice) return <div className="text-red-400">Invoice not found.</div>;

  return (
    <m.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/admin/invoices" className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors">
            <Icon icon="hugeicons:arrow-left-01" className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-md">Invoice {invoice.invoiceNumber}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={confirmDelete} className="bg-gray-800/80 backdrop-blur-sm border border-red-500/20 hover:border-red-500/50 hover:bg-red-900/30 text-red-400 hover:text-red-300 px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-red-900/10">
            <Icon icon="hugeicons:delete-01" className="w-5 h-5" />
            Delete
          </button>
          <button onClick={handleDownloadPDF} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-blue-500/25 border border-white/10">
            <Icon icon="hugeicons:download-04" className="w-5 h-5" />
            Download PDF
          </button>
        </div>
      </div>

      <div className="bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl flex justify-center relative overflow-hidden">
        {/* Glow effect behind invoice */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-500/10 blur-[100px] pointer-events-none z-0" />
        
        {/* Render Invoice Visual Preview */}
        <div 
          ref={invoiceRef} 
          className="bg-white p-12 text-black font-sans origin-top transform scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100 relative overflow-hidden z-10 shadow-2xl" 
          style={{ width: '800px', minHeight: '1120px' }}
        >
          {invoice.senderProfile?.watermarkUrl && (
            <div className="absolute inset-0 flex justify-center items-center opacity-[0.08] pointer-events-none z-0">
              <img src={invoice.senderProfile.watermarkUrl} alt="Watermark" className="w-[80%] object-contain" />
            </div>
          )}
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">INVOICE</h1>
                <p className="text-gray-500 mt-2 font-medium">{invoice.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-blue-600">{invoice.senderProfile?.name || invoice.fromName || 'Invoice Sender'}</h2>
                <p className="text-gray-600 mt-1 whitespace-pre-wrap text-sm">{invoice.senderProfile?.address || invoice.fromAddress || ''}</p>
              </div>
          </div>

          <div className="flex justify-between mb-12 bg-gray-50 p-6 rounded-lg border border-gray-100">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</p>
              <p className="text-lg font-bold text-gray-900">{invoice.toName}</p>
              <p className="text-gray-600 whitespace-pre-wrap max-w-[250px] mt-1 text-sm">{invoice.toAddress}</p>
              {invoice.gstEnabled && <p className="text-gray-500 text-sm mt-2 font-medium">GST: {invoice.gstNumber}</p>}
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Date of Issue</p>
              <p className="text-lg font-bold text-gray-900">{invoice.dateCreated}</p>
            </div>
          </div>

          <table className="w-full mb-12">
            <thead>
              <tr className="border-b-2 border-gray-900">
                <th className="py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Description</th>
                <th className="py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">Qty</th>
                <th className="py-3 text-right text-sm font-bold text-gray-900 uppercase tracking-wider">Price</th>
                <th className="py-3 text-right text-sm font-bold text-gray-900 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoice.items?.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-4 text-gray-800">{item.description}</td>
                  <td className="py-4 text-center text-gray-600">{item.quantity}</td>
                  <td className="py-4 text-right text-gray-600">{invoice.currencySymbol}{Number(item.unitPrice).toLocaleString()}</td>
                  <td className="py-4 text-right text-gray-900 font-medium">{invoice.currencySymbol}{(Number(item.quantity) * Number(item.unitPrice)).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mb-16">
            <div className="w-1/2">
              <div className="flex justify-between py-2 text-gray-600">
                <span>Subtotal</span>
                <span>{invoice.currencySymbol}{Number(invoice.subtotal).toLocaleString()}</span>
              </div>
              {invoice.gstEnabled && (
                <div className="flex justify-between py-2 text-gray-600 border-b border-gray-200">
                  <span>Tax (18%)</span>
                  <span>{invoice.currencySymbol}{Number(invoice.gstAmount).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between py-4 text-xl font-bold text-gray-900 border-b-4 border-gray-900">
                <span>Total</span>
                <span>{invoice.currencySymbol}{Number(invoice.totalAmount).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-start mt-24">
            <div className="text-sm text-gray-500 w-2/3 pr-8">
              {invoice.senderProfile ? (
                <>
                  <p className="font-bold text-gray-900 mb-2">Payment Details</p>
                  {(invoice.senderProfile.bankHolderName || invoice.senderProfile.bankAccountNumber || invoice.senderProfile.bankIfsc || invoice.senderProfile.bankName) && (
                    <div className="mb-4">
                      <p className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-1">Bank Transfer</p>
                      <p>Holder Name: {invoice.senderProfile.bankHolderName}</p>
                      <p>Account Number: {invoice.senderProfile.bankAccountNumber}</p>
                      <p>IFSC: {invoice.senderProfile.bankIfsc}</p>
                      <p>Bank: {invoice.senderProfile.bankName}</p>
                    </div>
                  )}
                  {invoice.senderProfile.upiId && (
                    <div>
                      <p className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-1">UPI</p>
                      <p>{invoice.senderProfile.upiId}</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p className="font-bold text-gray-900 mb-1">Payment Terms</p>
                  <p>Please pay within 15 days of receiving this invoice.</p>
                  <p className="mt-4">Thank you for your business!</p>
                </>
              )}
            </div>
            <div className="text-center w-1/3">
              <div className="w-full h-16 border-b border-gray-400 mb-2 flex items-end justify-center">
                {invoice.senderProfile?.signatureUrl && (
                  <img src={invoice.senderProfile.signatureUrl} className="max-h-16 object-contain pb-1" alt="Signature" />
                )}
              </div>
              <p className="text-sm font-bold text-gray-900 uppercase tracking-wider">Authorized Signature</p>
            </div>
          </div>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Invoice"
        message={`Are you sure you want to permanently delete Invoice ${invoice.invoiceNumber}? This action cannot be undone.`}
      />
    </m.div>
  );
};

export default ViewInvoice;
