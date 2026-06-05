import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/api/admin/invoices`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setInvoices(data.data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const confirmDelete = (id) => {
    setInvoiceToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!invoiceToDelete) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/api/admin/invoices/${invoiceToDelete}`, { 
        method: 'DELETE',
        credentials: 'include' 
      });
      if (res.ok) {
        fetchInvoices();
      }
    } catch (e) {
      console.error(e);
      alert('Failed to delete invoice');
    } finally {
      setInvoiceToDelete(null);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Invoices</h1>
        <Link
          to="/admin/invoices/create"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20"
        >
          <Icon icon="hugeicons:add-square" className="w-5 h-5" />
          Create Invoice
        </Link>
      </div>

      <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Icon icon="hugeicons:invoice-01" className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No invoices found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-900/50 border-b border-gray-700">
                  <th className="p-4 text-sm font-semibold text-gray-400">Inv #</th>
                  <th className="p-4 text-sm font-semibold text-gray-400">Date</th>
                  <th className="p-4 text-sm font-semibold text-gray-400">Client</th>
                  <th className="p-4 text-sm font-semibold text-gray-400">Total Amount</th>
                  <th className="p-4 text-sm font-semibold text-gray-400">Items</th>
                  <th className="p-4 text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-700/20 transition-colors">
                    <td className="p-4 text-white font-medium">#{inv.invoiceNumber}</td>
                    <td className="p-4 text-gray-300">{inv.dateCreated}</td>
                    <td className="p-4 text-blue-400">{inv.toName}</td>
                    <td className="p-4 text-green-400 font-bold">
                      {inv.currencySymbol} {Number(inv.totalAmount).toLocaleString()}
                    </td>
                    <td className="p-4 text-gray-400">{inv.items?.length || 0}</td>
                    <td className="p-4 text-gray-400 flex gap-2">
                      <Link to={`/admin/invoices/${inv.id}`} className="inline-block p-2 text-gray-400 hover:text-white transition-colors bg-gray-700/50 hover:bg-gray-600 rounded-lg" title="View PDF">
                        <Icon icon="hugeicons:view" className="w-5 h-5" />
                      </Link>
                      <button onClick={() => confirmDelete(inv.id)} className="inline-block p-2 text-red-400 hover:text-white transition-colors bg-red-900/20 hover:bg-red-600 rounded-lg" title="Delete Invoice">
                        <Icon icon="hugeicons:delete-01" className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Invoice"
        message="Are you sure you want to permanently delete this invoice? This action cannot be undone."
      />
    </m.div>
  );
};

export default AdminInvoices;
