import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import Header from '../components/Header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarDays } from 'lucide-react';

export default function BillingHistory() {
  const [bills, setBills] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({
    company: '',
    project: '',
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    fetchBillingHistory();
    fetchCompaniesAndProjects();
  }, []);

  const fetchBillingHistory = async (customFilters = filters) => {
    try {
      const params = {};
      if (customFilters.company) params.company_id = customFilters.company;
      if (customFilters.project) params.project_id = customFilters.project;

      if (customFilters.startDate) {
        params.start_month = customFilters.startDate.getMonth() + 1;
        params.start_year = customFilters.startDate.getFullYear();
      }

      if (customFilters.endDate) {
        params.end_month = customFilters.endDate.getMonth() + 1;
        params.end_year = customFilters.endDate.getFullYear();
      }

      console.log("Sending params to API:", params);
      const res = await axiosInstance.get('/billing/history', { params });
      console.log("Billing History Response:", res.data);
      setBills(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load billing history.');
    }
  };


  const fetchCompaniesAndProjects = async () => {
    try {
      const [companiesRes, projectsRes] = await Promise.all([
        axiosInstance.get('/companies'),
        axiosInstance.get('/projects')
      ]);
      setCompanies(companiesRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      toast.error('Failed to load filter options.');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = () => {
    fetchBillingHistory();
  };

  const resetFilters = () => {
    const defaultFilters = {
      company: '',
      project: '',
      startDate: null,
      endDate: null,
    };
    setFilters(defaultFilters);
    fetchBillingHistory(defaultFilters);
  };


  const getMonthName = (monthNumber) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[monthNumber - 1];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 font-sans">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Header />

      <main className="p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Billing History</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8 gap-4 items-end">
          <select
            name="company"
            value={filters.company}
            onChange={handleFilterChange}
            className="border p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition cursor-pointer"
          >
            <option value="">All Companies</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.company_name}</option>
            ))}
          </select>

          <select
            name="project"
            value={filters.project}
            onChange={handleFilterChange}
            className="border p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition cursor-pointer"
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.project_name}</option>
            ))}
          </select>

          <div className="flex gap-2 z-50">
            <div className="relative w-full">
              <DatePicker
                selected={filters.startDate}
                onChange={(date) => setFilters((prev) => ({ ...prev, startDate: date }))}
                className="border p-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 w-full pl-10"
                placeholderText="Start Date"
                dateFormat="dd-MM-yyyy"
                selectsStart
                startDate={filters.startDate}
                endDate={filters.endDate}
                popperPlacement="bottom-start"
              />
              <CalendarDays className="absolute left-2 top-2.5 text-gray-500 w-5 h-5 pointer-events-none" />
            </div>

            <div className="relative w-full">
              <DatePicker
                selected={filters.endDate}
                onChange={(date) => setFilters((prev) => ({ ...prev, endDate: date }))}
                className="border p-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 w-full pl-10"
                placeholderText="End Date"
                dateFormat="dd-MM-yyyy"
                selectsEnd
                startDate={filters.startDate}
                endDate={filters.endDate}
                minDate={filters.startDate}
                popperPlacement="bottom-start"
              />
              <CalendarDays className="absolute left-2 top-2.5 text-gray-500 w-5 h-5 pointer-events-none" />
            </div>
          </div>

        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={handleFilterSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 cursor-pointer"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>

        {/* Billing Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow border border-blue-100">
          <table className="w-full text-sm text-center table_fixed min-w-[900px]">
            <thead className="bg-blue-50 sticky top-0 z-10">
              <tr>
                <th className="p-3 border whitespace-nowrap">Type</th>
                <th className="p-3 border whitespace-nowrap">Company</th>
                <th className="p-3 border whitespace-nowrap">Contact Person</th>
                <th className="p-3 border whitespace-nowrap">Contact Email</th>
                <th className="p-3 border whitespace-nowrap">Month-Year</th>
                <th className="p-3 border whitespace-nowrap">Project Name</th>
                <th className="p-3 border whitespace-nowrap">Hosting Amount</th>
                <th className="p-3 border whitespace-nowrap">Currency</th>
                <th className="p-3 border whitespace-nowrap">Details</th>
              </tr>
            </thead>
            <tbody>
              {bills.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-4 text-gray-500">No billing records found.</td>
                </tr>
              ) : (
                bills.map((bill, idx) => {

                  const [month, year] = bill.month_year.split('-');
                  return (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                      <td className="p-2 border">{bill.type || 'Hosting'}</td>
                      <td className="p-2 border whitespace-nowrap">{bill.company || '-'}</td>
                      <td className="p-2 border">{bill.contact_person || '-'}</td>
                      <td className="p-2 border">{bill.contact_email || '-'}</td>
                      <td className="p-2 border whitespace-nowrap">
                        {month && year
                          ? `${getMonthName(Number(month))}-${year}`
                          : '-'}
                      </td>
                      <td className="p-2 border">{bill.project_name || '-'}</td>
                      <td className="p-2 border">{bill.hosting_amount || '-'}</td>
                      <td className="p-2 border">{bill.currency || '-'}</td>
                      <td className="p-2 border whitespace-nowrap">
                        {bill.details ? (
                          bill.details.startsWith('http') ? (
                            <a
                              href={bill.details}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline hover:text-blue-800"
                            >
                              {bill.details}
                            </a>
                          ) : (
                            bill.details.replace(/\d{2}-\d{4}/, `${getMonthName(Number(month))}-${year}`)
                          )
                        ) : (
                          '-'
                        )}
                      </td>

                    </tr>
                  )
                }
                )
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
