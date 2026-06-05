import React, { useState, useEffect, useRef } from 'react';
import { m } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

const CreateInvoice = () => {
  const [customers, setCustomers] = useState([]);
  const [senderProfiles, setSenderProfiles] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedSenderId, setSelectedSenderId] = useState('');
  const navigate = useNavigate();
  const invoiceRef = useRef(null);

  const [formData, setFormData] = useState({
    invoiceNumber: 'Loading...',
    dateCreated: new Date().toISOString().split('T')[0],
    items: [{ description: '', quantity: 1, unitPrice: 0 }]
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      try {
        const [numRes, custRes, sendRes] = await Promise.all([
          fetch(`${apiUrl}/api/admin/next-invoice-number`, { credentials: 'include' }),
          fetch(`${apiUrl}/api/admin/customers`, { credentials: 'include' }),
          fetch(`${apiUrl}/api/admin/sender-profiles`, { credentials: 'include' })
        ]);
        
        const numData = await numRes.json();
        const custData = await custRes.json();
        const sendData = await sendRes.json();

        if (numData.success) setFormData(prev => ({ ...prev, invoiceNumber: numData.nextInvoiceNumber }));
        if (custData.success) setCustomers(custData.data);
        if (sendData.success) {
          setSenderProfiles(sendData.data);
          if (sendData.data.length > 0) setSelectedSenderId(sendData.data[0].id);
        }
      } catch (err) {
        console.error('Error fetching initial data:', err);
      }
    };
    fetchInitialData();
  }, []);



  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { description: '', quantity: 1, unitPrice: 0 }] });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    let gstAmount = 0;
    if (selectedCustomer?.gstEnabled) {
      gstAmount = subtotal * 0.18;
    }
    const totalAmount = subtotal + gstAmount;
    return { subtotal, gstAmount, totalAmount };
  };

  const { subtotal, gstAmount, totalAmount } = calculateTotals();

  const handleSaveInvoice = async () => {
    if (!selectedCustomer) return alert('Select a customer');
    setSaving(true);
    
    const payload = {
      invoiceNumber: formData.invoiceNumber,
      customerId: selectedCustomerId,
      senderProfileId: selectedSenderId,
      senderProfile: selectedSender,
      toName: selectedCustomer.name,
      toAddress: selectedCustomer.address,
      currencyCode: selectedCustomer.currencyCode,
      currencySymbol: selectedCustomer.currencySymbol,
      gstEnabled: selectedCustomer.gstEnabled,
      subtotal,
      gstAmount,
      totalAmount,
      dateCreated: formData.dateCreated,
      items: formData.items
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/api/admin/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        navigate('/admin/invoices');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to save invoice');
    }
    setSaving(false);
  };

  const handleDownloadPDF = () => {
    if (!selectedCustomer) return alert('Select a customer first to generate PDF');
    const element = invoiceRef.current;
    element.classList.remove('hidden');
    const opt = {
      margin: 10,
      filename: `${formData.invoiceNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save().then(() => {
      element.classList.add('hidden');
    });
  };

  const selectedSender = senderProfiles.find(s => s.id === selectedSenderId);

  return (
    <m.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Create Invoice</h1>
        <div className="flex gap-3">
          <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all">
            <Icon icon="hugeicons:file-download-02" className="w-5 h-5" /> Download PDF
          </button>
          <button onClick={handleSaveInvoice} disabled={saving} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20">
            <Icon icon="hugeicons:save-01" className="w-5 h-5" /> Save
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl mb-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Icon icon="hugeicons:file-02" className="text-blue-400" />
              Invoice Details
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Invoice Number</label>
                <input value={formData.invoiceNumber} onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
                <input type="date" value={formData.dateCreated} onChange={(e) => setFormData({...formData, dateCreated: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Sender Profile (You)</label>
                <select value={selectedSenderId} onChange={(e) => setSelectedSenderId(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors">
                  {senderProfiles.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Client (Billed To)</label>
                <select value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors">
                  <option value="">Select a client...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            {selectedCustomer && (
              <div className="mt-4 p-4 bg-gray-900 rounded-xl border border-gray-700">
                <p className="text-white font-medium">{selectedCustomer.name}</p>
                <p className="text-gray-400 text-sm">{selectedCustomer.address}</p>
                {selectedCustomer.gstEnabled && <p className="text-blue-400 text-sm mt-1">GST: {selectedCustomer.gstNumber}</p>}
              </div>
            )}
          </div>

          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Line Items</h2>
              <button onClick={addItem} className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm font-medium">
                <Icon icon="hugeicons:add-circle" className="w-5 h-5" /> Add Item
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-4 items-start bg-gray-900 p-4 rounded-xl border border-gray-700">
                  <div className="flex-1">
                    <input placeholder="Item Description" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className="w-full bg-transparent border-b border-gray-700 px-2 py-1 text-white focus:outline-none focus:border-blue-500 mb-2" />
                    <div className="flex gap-4">
                      <div className="w-1/3">
                        <label className="text-xs text-gray-500">Qty</label>
                        <input type="number" min="1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))} className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm" />
                      </div>
                      <div className="w-2/3">
                        <label className="text-xs text-gray-500">Price ({selectedCustomer?.currencySymbol || '$'})</label>
                        <input type="number" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))} className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-300 p-1">
                      <Icon icon="hugeicons:delete-01" className="w-5 h-5" />
                    </button>
                    <span className="text-white font-medium mt-2">
                      {selectedCustomer?.currencySymbol || '$'} {((item.quantity || 0) * (item.unitPrice || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl h-fit sticky top-24">
          <h2 className="text-xl font-bold text-white mb-6">Summary</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span className="text-white">{selectedCustomer?.currencySymbol || '$'} {subtotal.toLocaleString()}</span>
            </div>
            {selectedCustomer?.gstEnabled && (
              <div className="flex justify-between text-blue-400">
                <span>Tax (18%)</span>
                <span>{selectedCustomer?.currencySymbol || '$'} {gstAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="pt-4 border-t border-gray-700 flex justify-between items-center">
              <span className="text-lg font-bold text-white">Total</span>
              <span className="text-2xl font-bold text-green-400">{selectedCustomer?.currencySymbol || '$'} {totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden PDF Template */}
      <div className="hidden">
        <div ref={invoiceRef} className="bg-white p-12 text-black w-[800px] min-h-[1120px] mx-auto font-sans relative overflow-hidden">
          {selectedSender?.watermarkUrl && (
            <div className="absolute inset-0 flex justify-center items-center opacity-[0.08] pointer-events-none z-0">
              <img src={selectedSender.watermarkUrl} alt="Watermark" className="w-[80%] object-contain" />
            </div>
          )}
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">INVOICE</h1>
              <p className="text-gray-500 mt-2 font-medium">{formData.invoiceNumber}</p>
            </div>
            <div className="text-right">
              {selectedSender ? (
                <>
                  <h2 className="text-2xl font-bold text-blue-600">{selectedSender.name}</h2>
                  <p className="text-gray-600 mt-1 whitespace-pre-wrap text-sm">{selectedSender.address}</p>
                </>
              ) : (
                <h2 className="text-2xl font-bold text-blue-600">Invoice Sender</h2>
              )}
            </div>
          </div>

          <div className="flex justify-between mb-12 bg-gray-50 p-6 rounded-lg border border-gray-100">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</p>
              {selectedCustomer ? (
                <>
                  <p className="text-lg font-bold text-gray-900">{selectedCustomer.name}</p>
                  <p className="text-gray-600 whitespace-pre-wrap max-w-[250px] mt-1 text-sm">{selectedCustomer.address}</p>
                  {selectedCustomer.gstEnabled && <p className="text-gray-500 text-sm mt-2 font-medium">GST: {selectedCustomer.gstNumber}</p>}
                </>
              ) : (
                <p className="text-gray-400 italic">No customer selected</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Date of Issue</p>
              <p className="text-lg font-bold text-gray-900">{formData.dateCreated}</p>
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
              {formData.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-4 text-gray-800">{item.description}</td>
                  <td className="py-4 text-center text-gray-600">{item.quantity}</td>
                  <td className="py-4 text-right text-gray-600">{selectedCustomer?.currencySymbol || '$'}{item.unitPrice.toLocaleString()}</td>
                  <td className="py-4 text-right text-gray-900 font-medium">{selectedCustomer?.currencySymbol || '$'}{(item.quantity * item.unitPrice).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mb-16">
            <div className="w-1/2">
              <div className="flex justify-between py-2 text-gray-600">
                <span>Subtotal</span>
                <span>{selectedCustomer?.currencySymbol || '$'}{subtotal.toLocaleString()}</span>
              </div>
              {selectedCustomer?.gstEnabled && (
                <div className="flex justify-between py-2 text-gray-600 border-b border-gray-200">
                  <span>Tax (18%)</span>
                  <span>{selectedCustomer?.currencySymbol || '$'}{gstAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between py-4 text-xl font-bold text-gray-900 border-b-4 border-gray-900">
                <span>Total</span>
                <span>{selectedCustomer?.currencySymbol || '$'}{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-start mt-24">
            <div className="text-sm text-gray-500 w-2/3 pr-8">
              {selectedSender ? (
                <>
                  <p className="font-bold text-gray-900 mb-2">Payment Details</p>
                  {(selectedSender.bankHolderName || selectedSender.bankAccountNumber || selectedSender.bankIfsc || selectedSender.bankName) && (
                    <div className="mb-4">
                      <p className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-1">Bank Transfer</p>
                      <p>Holder Name: {selectedSender.bankHolderName}</p>
                      <p>Account Number: {selectedSender.bankAccountNumber}</p>
                      <p>IFSC: {selectedSender.bankIfsc}</p>
                      <p>Bank: {selectedSender.bankName}</p>
                    </div>
                  )}
                  {selectedSender.upiId && (
                    <div>
                      <p className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-1">UPI</p>
                      <p>{selectedSender.upiId}</p>
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
                {selectedSender?.signatureUrl && (
                  <img src={selectedSender.signatureUrl} className="max-h-16 object-contain pb-1" alt="Signature" />
                )}
              </div>
              <p className="text-sm font-bold text-gray-900 uppercase tracking-wider">Authorized Signature</p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </m.div>
  );
};

export default CreateInvoice;
