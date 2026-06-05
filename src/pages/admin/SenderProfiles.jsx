import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { Icon } from '@iconify/react';

const AdminSenderProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: '', name: '', address: '', bankHolderName: '', bankAccountNumber: '', bankIfsc: '', bankName: '', upiId: '', signatureUrl: '', watermarkUrl: ''
  });

  const fetchProfiles = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/api/admin/sender-profiles`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setProfiles(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleOpenModal = (profile = null) => {
    if (profile) {
      setFormData(profile);
      setIsEditing(true);
    } else {
      setFormData({ id: '', name: '', address: '', bankHolderName: '', bankAccountNumber: '', bankIfsc: '', bankName: '', upiId: '', signatureUrl: '', watermarkUrl: '' });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const method = isEditing ? 'PUT' : 'POST';
    const endpoint = isEditing ? `/api/admin/sender-profiles/${formData.id}` : '/api/admin/sender-profiles';
    
    try {
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchProfiles();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="text-white p-8">Loading sender profiles...</div>;

  return (
    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Sender Profiles</h1>
        <button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
          <Icon icon="hugeicons:plus-sign" className="w-5 h-5" />
          Add Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profiles.map(p => (
          <div key={p.id} className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleOpenModal(p)} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-blue-400 transition-colors">
                <Icon icon="hugeicons:edit-01" className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-blue-400">{p.name}</h2>
              <p className="text-gray-400 mt-1 whitespace-pre-wrap">{p.address}</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-700">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Bank Transfer</h3>
                <p className="text-gray-400 text-sm">Holder: <span className="text-white">{p.bankHolderName || '-'}</span></p>
                <p className="text-gray-400 text-sm">A/C: <span className="text-white">{p.bankAccountNumber || '-'}</span></p>
                <p className="text-gray-400 text-sm">IFSC: <span className="text-white">{p.bankIfsc || '-'}</span></p>
                <p className="text-gray-400 text-sm">Bank: <span className="text-white">{p.bankName || '-'}</span></p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wider">UPI</h3>
                <p className="text-white text-sm font-medium">{p.upiId || '-'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <m.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl border border-gray-700 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Profile' : 'Add Profile'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><Icon icon="hugeicons:cancel-01" className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Profile Name (e.g. Karthik Narayanan, Web Emporia)</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Address</label>
                  <textarea rows="2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" />
                </div>
                
                <div className="col-span-2 pt-4 border-t border-gray-700">
                  <h3 className="text-md font-bold text-blue-400 mb-4">Invoice Branding Images</h3>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Signature Image</label>
                  {formData.signatureUrl && <img src={formData.signatureUrl} className="h-12 object-contain mb-2 bg-white rounded p-1" alt="Signature" />}
                  <input type="file" accept="image/*" onChange={async (e) => {
                    if (e.target.files[0]) {
                      const data = new FormData();
                      data.append('image', e.target.files[0]);
                      const apiUrl = import.meta.env.VITE_API_URL || '';
                      const res = await fetch(`${apiUrl}/api/admin/upload`, {
                        method: 'POST', credentials: 'include', body: data
                      });
                      const json = await res.json();
                      if (json.success) setFormData({...formData, signatureUrl: json.url});
                    }
                  }} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Watermark Background</label>
                  {formData.watermarkUrl && <img src={formData.watermarkUrl} className="h-12 object-contain mb-2 bg-white rounded p-1" alt="Watermark" />}
                  <input type="file" accept="image/*" onChange={async (e) => {
                    if (e.target.files[0]) {
                      const data = new FormData();
                      data.append('image', e.target.files[0]);
                      const apiUrl = import.meta.env.VITE_API_URL || '';
                      const res = await fetch(`${apiUrl}/api/admin/upload`, {
                        method: 'POST', credentials: 'include', body: data
                      });
                      const json = await res.json();
                      if (json.success) setFormData({...formData, watermarkUrl: json.url});
                    }
                  }} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
                </div>

                <div className="col-span-2 pt-4 border-t border-gray-700">
                  <h3 className="text-md font-bold text-blue-400 mb-4">Bank Transfer Details</h3>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Account Holder Name</label>
                  <input value={formData.bankHolderName} onChange={e => setFormData({...formData, bankHolderName: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Account Number</label>
                  <input value={formData.bankAccountNumber} onChange={e => setFormData({...formData, bankAccountNumber: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">IFSC Code</label>
                  <input value={formData.bankIfsc} onChange={e => setFormData({...formData, bankIfsc: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Bank Name</label>
                  <input value={formData.bankName} onChange={e => setFormData({...formData, bankName: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" />
                </div>

                <div className="col-span-2 pt-4 border-t border-gray-700">
                  <h3 className="text-md font-bold text-blue-400 mb-4">UPI Details</h3>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">UPI ID</label>
                  <input value={formData.upiId} onChange={e => setFormData({...formData, upiId: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">Save Profile</button>
              </div>
            </form>
          </m.div>
        </div>
      )}
    </m.div>
  );
};

export default AdminSenderProfiles;
