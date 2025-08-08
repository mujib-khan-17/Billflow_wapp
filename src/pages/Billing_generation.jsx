import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';

export default function BillingGeneration() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [bills, setBills] = useState([]);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/billing/preview', {
        month: month + 1,
        year,
      });
      setBills(res.data);
      setGenerated(true);
      if (res.data.length === 0) {
        toast.info('No new billing records to generate for this month.');
      } else {
        toast.success('Billing preview generated successfully!');
      }
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Failed to generate billing preview.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (bills.length === 0) {
      toast.warn('No billing data to save.');
      return;
    }

    const payload = bills.map((bill) => ({
      project_id: bill.project_id,
      amount: bill.hosting_amount,
      currency: bill.currency,
      month: month + 1,
      year: year,
      details: bill.details,
    }));

    setSaving(true);
    try {
      const res = await axiosInstance.post('/billing/save', payload);
      toast.success(`${res.data.length} Billing record's saved successfully.`);
      setGenerated(false);
      setBills([]);
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Failed to save billing.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setBills([]);
    setGenerated(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 font-sans">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <Header />

      {/* Main Content */}
      <main className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Billing Generation</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
          <div>
            <label className="text-m font-medium mb-2 block">Select Month</label>
            <select
              className="border border-gray-400 rounded p-2 focus:outline-none focus:border-black"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-m font-medium mb-2 block">Select Year</label>
            <DatePicker
              selected={new Date(year, 0)}
              onChange={(date) => setYear(date.getFullYear())}
              showYearPicker
              dateFormat="yyyy"
              className="border border-gray-400 rounded p-2"
              placeholderText="Select year"
            />
          </div>

          <div className="flex gap-2 mt-4 sm:mt-6">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow cursor-pointer transition"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Billing'}
            </button>
            {generated && (
              <>
                {bills.length > 0 && (
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow cursor-pointer"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Billing'}
                  </button>
                )}
                <button
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 cursor-pointer shadow"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </>
            )}

          </div>
        </div>

        {bills.length > 0 && (
          <div className="overflow-x-auto bg-white rounded-xl shadow border border-blue-100">
            <h3 className="text-lg font-semibold p-4 text-blue-700">Generated Bills</h3>
            <table className="w-full text-sm text-center min-w-[900px]">
              <thead className="bg-blue-50 sticky top-0 z-10">
                <tr>
                  <th className="p-3 border">Type</th>
                  <th className="p-3 border">Company</th>
                  <th className="p-3 border">Contact Person</th>
                  <th className="p-3 border">Contact Email</th>
                  <th className="p-3 border">Month - Year</th>
                  <th className="p-3 border">Project Name</th>
                  <th className="p-3 border">Hosting Amount</th>
                  <th className="p-3 border">Currency</th>
                  <th className="p-3 border">Details</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                    <td className="p-2 border">{bill.type || 'Hosting'}</td>
                    <td className="p-2 border">{bill.company || '-'}</td>
                    <td className="p-2 border">{bill.contact_person || '-'}</td>
                    <td className="p-2 border">{bill.contact_email || '-'}</td>
                    <td className="p-2 border">{bill.month_year || '-'}</td>
                    <td className="p-2 border">{bill.project_name || '-'}</td>
                    <td className="p-2 border">{bill.hosting_amount || '-'}</td>
                    <td className="p-2 border">{bill.currency || '-'}</td>
                    <td className="p-2 border">{bill.details || '-'}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </main>
    </div>
  );
}
