import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { Icon } from '@iconify/react';

const CURRENCIES = [
  { code: 'AED', symbol: 'د.إ' }, { code: 'AFN', symbol: '؋' }, { code: 'ALL', symbol: 'L' }, { code: 'AMD', symbol: '֏' },
  { code: 'ANG', symbol: 'ƒ' }, { code: 'AOA', symbol: 'Kz' }, { code: 'ARS', symbol: '$' }, { code: 'AUD', symbol: 'A$' },
  { code: 'AWG', symbol: 'ƒ' }, { code: 'AZN', symbol: '₼' }, { code: 'BAM', symbol: 'KM' }, { code: 'BBD', symbol: '$' },
  { code: 'BDT', symbol: '৳' }, { code: 'BGN', symbol: 'лв' }, { code: 'BHD', symbol: '.د.ب' }, { code: 'BIF', symbol: 'FBu' },
  { code: 'BMD', symbol: '$' }, { code: 'BND', symbol: '$' }, { code: 'BOB', symbol: '$b' }, { code: 'BRL', symbol: 'R$' },
  { code: 'BSD', symbol: '$' }, { code: 'BTN', symbol: 'Nu.' }, { code: 'BWP', symbol: 'P' }, { code: 'BYN', symbol: 'Br' },
  { code: 'BZD', symbol: 'BZ$' }, { code: 'CAD', symbol: 'C$' }, { code: 'CDF', symbol: 'FC' }, { code: 'CHF', symbol: 'CHF' },
  { code: 'CLP', symbol: '$' }, { code: 'CNY', symbol: '¥' }, { code: 'COP', symbol: '$' }, { code: 'CRC', symbol: '₡' },
  { code: 'CUP', symbol: '₱' }, { code: 'CVE', symbol: '$' }, { code: 'CZK', symbol: 'Kč' }, { code: 'DJF', symbol: 'Fdj' },
  { code: 'DKK', symbol: 'kr' }, { code: 'DOP', symbol: 'RD$' }, { code: 'DZD', symbol: 'دج' }, { code: 'EGP', symbol: '£' },
  { code: 'ERN', symbol: 'Nfk' }, { code: 'ETB', symbol: 'Br' }, { code: 'EUR', symbol: '€' }, { code: 'FJD', symbol: '$' },
  { code: 'FKP', symbol: '£' }, { code: 'GBP', symbol: '£' }, { code: 'GEL', symbol: '₾' }, { code: 'GHS', symbol: 'GH₵' },
  { code: 'GIP', symbol: '£' }, { code: 'GMD', symbol: 'D' }, { code: 'GNF', symbol: 'FG' }, { code: 'GTQ', symbol: 'Q' },
  { code: 'GYD', symbol: '$' }, { code: 'HKD', symbol: '$' }, { code: 'HNL', symbol: 'L' }, { code: 'HRK', symbol: 'kn' },
  { code: 'HTG', symbol: 'G' }, { code: 'HUF', symbol: 'Ft' }, { code: 'IDR', symbol: 'Rp' }, { code: 'ILS', symbol: '₪' },
  { code: 'INR', symbol: '₹' }, { code: 'IQD', symbol: 'ع.د' }, { code: 'IRR', symbol: '﷼' }, { code: 'ISK', symbol: 'kr' },
  { code: 'JMD', symbol: 'J$' }, { code: 'JOD', symbol: 'د.ا' }, { code: 'JPY', symbol: '¥' }, { code: 'KES', symbol: 'KSh' },
  { code: 'KGS', symbol: 'лв' }, { code: 'KHR', symbol: '៛' }, { code: 'KMF', symbol: 'CF' }, { code: 'KPW', symbol: '₩' },
  { code: 'KRW', symbol: '₩' }, { code: 'KWD', symbol: 'د.ك' }, { code: 'KYD', symbol: '$' }, { code: 'KZT', symbol: '₸' },
  { code: 'LAK', symbol: '₭' }, { code: 'LBP', symbol: '£' }, { code: 'LKR', symbol: '₨' }, { code: 'LRD', symbol: '$' },
  { code: 'LSL', symbol: 'L' }, { code: 'LYD', symbol: 'ل.د' }, { code: 'MAD', symbol: 'د.م.' }, { code: 'MDL', symbol: 'L' },
  { code: 'MGA', symbol: 'Ar' }, { code: 'MKD', symbol: 'ден' }, { code: 'MMK', symbol: 'K' }, { code: 'MNT', symbol: '₮' },
  { code: 'MOP', symbol: 'MOP$' }, { code: 'MRU', symbol: 'UM' }, { code: 'MUR', symbol: '₨' }, { code: 'MVR', symbol: 'Rf' },
  { code: 'MWK', symbol: 'MK' }, { code: 'MXN', symbol: '$' }, { code: 'MYR', symbol: 'RM' }, { code: 'MZN', symbol: 'MT' },
  { code: 'NAD', symbol: '$' }, { code: 'NGN', symbol: '₦' }, { code: 'NIO', symbol: 'C$' }, { code: 'NOK', symbol: 'kr' },
  { code: 'NPR', symbol: '₨' }, { code: 'NZD', symbol: '$' }, { code: 'OMR', symbol: 'ر.ع.' }, { code: 'PAB', symbol: 'B/.' },
  { code: 'PEN', symbol: 'S/.' }, { code: 'PGK', symbol: 'K' }, { code: 'PHP', symbol: '₱' }, { code: 'PKR', symbol: '₨' },
  { code: 'PLN', symbol: 'zł' }, { code: 'PYG', symbol: 'Gs' }, { code: 'QAR', symbol: 'ر.ق' }, { code: 'RON', symbol: 'lei' },
  { code: 'RSD', symbol: 'Дин.' }, { code: 'RUB', symbol: '₽' }, { code: 'RWF', symbol: 'R₣' }, { code: 'SAR', symbol: 'ر.س' },
  { code: 'SBD', symbol: '$' }, { code: 'SCR', symbol: '₨' }, { code: 'SDG', symbol: 'ج.س.' }, { code: 'SEK', symbol: 'kr' },
  { code: 'SGD', symbol: 'S$' }, { code: 'SHP', symbol: '£' }, { code: 'SLL', symbol: 'Le' }, { code: 'SOS', symbol: 'S' },
  { code: 'SRD', symbol: '$' }, { code: 'SSP', symbol: '£' }, { code: 'STN', symbol: 'Db' }, { code: 'SYP', symbol: '£' },
  { code: 'SZL', symbol: 'L' }, { code: 'THB', symbol: '฿' }, { code: 'TJS', symbol: 'SM' }, { code: 'TMT', symbol: 'T' },
  { code: 'TND', symbol: 'د.ت' }, { code: 'TOP', symbol: 'T$' }, { code: 'TRY', symbol: '₺' }, { code: 'TTD', symbol: 'TT$' },
  { code: 'TVD', symbol: '$' }, { code: 'TWD', symbol: 'NT$' }, { code: 'TZS', symbol: 'TSh' }, { code: 'UAH', symbol: '₴' },
  { code: 'UGX', symbol: 'USh' }, { code: 'USD', symbol: '$' }, { code: 'UYU', symbol: '$U' }, { code: 'UZS', symbol: 'лв' },
  { code: 'VES', symbol: 'Bs.S.' }, { code: 'VND', symbol: '₫' }, { code: 'VUV', symbol: 'VT' }, { code: 'WST', symbol: 'WS$' },
  { code: 'XAF', symbol: 'FCFA' }, { code: 'XCD', symbol: '$' }, { code: 'XOF', symbol: 'CFA' }, { code: 'XPF', symbol: '₣' },
  { code: 'YER', symbol: '﷼' }, { code: 'ZAR', symbol: 'R' }, { code: 'ZMW', symbol: 'ZK' }, { code: 'ZWL', symbol: 'Z$' }
];

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    address: '',
    currencyCode: 'USD',
    currencySymbol: '$',
    gstEnabled: false,
    gstNumber: ''
  });

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/api/admin/customers`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setCustomers(data.data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleOpenForm = (customer = null) => {
    if (customer) {
      setFormData(customer);
      setIsEditing(true);
      setShowForm(true);
    } else {
      setFormData({ id: '', name: '', address: '', currencyCode: 'USD', currencySymbol: '$', gstEnabled: false, gstNumber: '' });
      setIsEditing(false);
      setShowForm(!showForm);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const method = isEditing ? 'PUT' : 'POST';
      const endpoint = isEditing ? `/api/admin/customers/${formData.id}` : '/api/admin/customers';

      const res = await fetch(`${apiUrl}${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({ id: '', name: '', address: '', currencyCode: 'USD', currencySymbol: '$', gstEnabled: false, gstNumber: '' });
        setIsEditing(false);
        fetchCustomers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Customers</h1>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20"
        >
          <Icon icon={showForm && !isEditing ? "hugeicons:cancel-01" : "hugeicons:add-01"} className="w-5 h-5" />
          {showForm && !isEditing ? 'Cancel' : 'Add Customer'}
        </button>
      </div>

      {showForm && (
        <m.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl overflow-hidden"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Customer Profile' : 'New Customer Profile'}</h2>
            {isEditing && (
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                <Icon icon="hugeicons:cancel-01" className="w-6 h-6" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Company Name</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500" placeholder="e.g. Acme Corp" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Billing Address</label>
              <textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 min-h-[44px]" placeholder="Full address..." />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Currency Code</label>
              <select 
                required 
                value={formData.currencyCode} 
                onChange={e => {
                  const selected = CURRENCIES.find(c => c.code === e.target.value);
                  setFormData({
                    ...formData, 
                    currencyCode: selected.code,
                    currencySymbol: selected.symbol
                  });
                }} 
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.code} - {c.symbol}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Currency Symbol</label>
              <input 
                readOnly 
                disabled
                value={formData.currencySymbol} 
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-500 cursor-not-allowed" 
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-4">
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input type="checkbox" checked={formData.gstEnabled} onChange={e => setFormData({...formData, gstEnabled: e.target.checked})} className="w-5 h-5 rounded border-gray-700 text-blue-500 focus:ring-blue-500 bg-gray-900" />
                Enable GST / Tax
              </label>
              {formData.gstEnabled && (
                <div className="flex-1">
                  <input value={formData.gstNumber} onChange={e => setFormData({...formData, gstNumber: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-blue-500" placeholder="Enter Tax/GST Number" />
                </div>
              )}
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-medium shadow-lg">Save Customer</button>
          </div>
        </m.form>
      )}

      <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Icon icon="hugeicons:user-group" className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No customers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900/50 border-b border-gray-700">
                  <th className="p-4 text-sm font-semibold text-gray-400">Company Name</th>
                  <th className="p-4 text-sm font-semibold text-gray-400">Address</th>
                  <th className="p-4 text-sm font-semibold text-gray-400">Currency</th>
                  <th className="p-4 text-sm font-semibold text-gray-400">Tax Setup</th>
                  <th className="p-4 text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-700/20 transition-colors">
                    <td className="p-4 text-white font-medium">{c.name}</td>
                    <td className="p-4 text-gray-400 text-sm max-w-[250px] truncate">{c.address}</td>
                    <td className="p-4 text-gray-300">
                      <span className="bg-gray-700 px-2 py-1 rounded text-xs">{c.currencyCode} ({c.currencySymbol})</span>
                    </td>
                    <td className="p-4 text-gray-300">
                      {c.gstEnabled ? <span className="text-blue-400 text-sm">GST: {c.gstNumber}</span> : <span className="text-gray-500 text-sm">N/A</span>}
                    </td>
                    <td className="p-4">
                      <button onClick={() => handleOpenForm(c)} className="p-2 text-gray-400 hover:text-white transition-colors bg-gray-700/50 hover:bg-gray-600 rounded-lg">
                        <Icon icon="hugeicons:edit-01" className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </m.div>
  );
};

export default AdminCustomers;
