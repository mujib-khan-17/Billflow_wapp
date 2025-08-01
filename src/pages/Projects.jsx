import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import axiosInstance from '../axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProjectManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    project_code: '',
    project_name: '',
    beta_url: '',
    beta_server: '',
    beta_release_date: '',
    production_url: '',
    production_server: '',
    live_date: '',
    hosting_amount: '',
    hosting_start_date: '',
    company_id: '',
    currency: '',
    status: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [projects, setProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async (status = '', searchTerm = '') => {
    try {
      let url = '/projects?';
      if (status) url += `status=${encodeURIComponent(status)}&`;
      if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}`;
      const res = await axiosInstance.get(url);
      setProjects(res.data);
    } catch (err) {
      toast.error('Failed to fetch projects.');
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setEditMode(false);
    setForm({
      project_code: '',
      project_name: '',
      beta_url: '',
      beta_server: '',
      beta_release_date: '',
      production_url: '',
      production_server: '',
      live_date: '',
      hosting_amount: '',
      hosting_start_date: '',
      company_id: '',
      currency: '',
      status: '',
    });
  };

  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    let value = e.target.value;
    if (['company_id', 'hosting_amount'].includes(e.target.name)) {
      value = value === '' ? '' : Number(value);
    }
    setForm({ ...form, [e.target.name]: value });
  };

  const cleanPayload = (payload) => {
    const cleaned = { ...payload };
    const dateFields = ['beta_release_date', 'live_date', 'hosting_start_date'];

    Object.keys(cleaned).forEach((key) => {
      const value = cleaned[key];
      if (key === 'id') delete cleaned[key];
      else if (
        (value === '' || value === undefined || value === null) &&
        !['project_code', 'project_name', 'production_url', 'production_server', 'currency', 'status', 'hosting_amount', 'beta_url', 'beta_server'].includes(key)
      ) {
        delete cleaned[key];
      } else if (dateFields.includes(key) && isNaN(Date.parse(value))) delete cleaned[key];
    });

    return cleaned;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitForm = cleanPayload(form);
      if (editMode) {
        const { id, ...updateData } = submitForm;
        await axiosInstance.put(`/projects/${form.id}`, updateData);
        toast.success('Project updated successfully!');
      } else {
        await axiosInstance.post('/projects', submitForm);
        toast.success('Project added successfully!');
      }
      await fetchProjects();
      closeModal();
    } catch (err) {
      const response = err?.response?.data;

      if (response?.detail && Array.isArray(response.detail)) {
        const messages = response.detail.map((d) => {
          const field = d?.loc?.[d.loc.length - 1];
          const msg = d?.msg;
          return `${field}: ${msg}`;
        }).join('\n');
        toast.error(messages);
      } else if (response?.detail) {
        toast.error(response.detail);
      } else {
        toast.error('Failed to save project');
      }

      console.error('Save error:', err);
    }
  };

  const confirmDelete = (project) => {
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const performDelete = async () => {
    try {
      await axiosInstance.delete(`/projects/${projectToDelete.id}`);
      await fetchProjects();
      setDeleteModalOpen(false);
      setProjectToDelete(null);
      toast.success('Project deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete project.');
    }
  };

  const openEditModal = (project) => {
    setForm({
      id: project.id,
      project_code: project.project_code || '',
      project_name: project.project_name || '',
      beta_url: project.beta_url || '',
      beta_server: project.beta_server || '',
      beta_release_date: project.beta_release_date ? project.beta_release_date.slice(0, 10) : '',
      production_url: project.production_url || '',
      production_server: project.production_server || '',
      live_date: project.live_date ? project.live_date.slice(0, 10) : '',
      hosting_amount: project.hosting_amount || '',
      hosting_start_date: project.hosting_start_date ? project.hosting_start_date.slice(0, 10) : '',
      company_id: project.company_id || '',
      currency: project.currency || '',
      status: project.status || '',
    });
    setIsModalOpen(true);
    setEditMode(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 font-sans">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <header className="w-full bg-white shadow-md py-4 px-4 sm:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <img src="/addnectar_logo.png" alt="Logo" className="h-8" />
          <span className="text-xl font-bold text-blue-700">Billflow</span>
          <nav className="flex flex-wrap gap-2 sm:gap-4 text-gray-700 text-sm sm:text-base">
            <a className="hover:text-blue-600 transition" href="#">Dashboard</a>
            <a className="text-blue-700 font-semibold underline underline-offset-4" href="#">Projects</a>
            <a className="hover:text-blue-600 transition" href="#">Billing Generation</a>
            <a className="hover:text-blue-600 transition" href="#">Billing History</a>
          </nav>
        </div>
        <button
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded shadow cursor-pointer"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </header>

      <main className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 mb-6 gap-4">
          <h1 className="text-2xl font-bold text-blue-700">Project Management</h1>
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow cursor-pointer w-full sm:w-auto"
            onClick={openModal}
          >
            Add Project
          </button>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="relative bg-white rounded-2xl w-full max-w-xl mx-4 p-8 shadow-2xl z-50 max-h-[90vh] overflow-y-auto border border-blue-100">
              <h2 className="text-2xl font-bold mb-6 text-blue-700">{editMode ? 'Edit' : 'Add'} Project</h2>
              <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {editMode && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                      <input name="id" value={form.id || ''} onChange={handleChange} type="text" className="p-2 border border-gray-300 rounded w-full" disabled />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Code</label>
                    <input name="project_code" value={form.project_code} onChange={handleChange} type="text" className="p-2 border border-gray-300 rounded w-full" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                    <input name="project_name" value={form.project_name} onChange={handleChange} type="text" className="p-2 border border-gray-300 rounded w-full" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Beta URL</label>
                    <input name="beta_url" value={form.beta_url} onChange={handleChange} type="text" className="p-2 border border-gray-300 rounded w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Beta Server</label>
                    <input name="beta_server" value={form.beta_server} onChange={handleChange} type="text" className="p-2 border border-gray-300 rounded w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Beta Release Date</label>
                    <input name="beta_release_date" value={form.beta_release_date} onChange={handleChange} type="date" className="p-2 border border-gray-300 rounded w-full cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Production URL</label>
                    <input name="production_url" value={form.production_url} onChange={handleChange} type="text" className="p-2 border border-gray-300 rounded w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Production Server</label>
                    <input name="production_server" value={form.production_server} onChange={handleChange} type="text" className="p-2 border border-gray-300 rounded w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Live Date</label>
                    <input name="live_date" value={form.live_date} onChange={handleChange} type="date" className="p-2 border border-gray-300 rounded w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hosting Amount</label>
                    <input name="hosting_amount" value={form.hosting_amount} onChange={handleChange} type="number" className="p-2 border border-gray-300 rounded w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hosting Start Date</label>
                    <input name="hosting_start_date" value={form.hosting_start_date} onChange={handleChange} type="date" className="p-2 border border-gray-300 rounded w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company ID</label>
                    <input name="company_id" value={form.company_id} onChange={handleChange} type="number" className="p-2 border border-gray-300 rounded w-full" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <input name="currency" value={form.currency} onChange={handleChange} type="text" className="p-2 border border-gray-300 rounded w-full" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select name="status" value={form.status} onChange={handleChange} className="p-2 border border-gray-300 rounded w-full cursor-pointer" required>
                      <option value="">Status</option>
                      <option value="WIP">WIP</option>
                      <option value="Beta">Beta</option>
                      <option value="Production">Production</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end mt-6 gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer transition"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer transition"
                  >
                    {editMode ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Filters */}
        <section className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={async (e) => {
                setSearch(e.target.value);
                await fetchProjects(statusFilter, e.target.value);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer transition"
              value={statusFilter}
              onChange={async (e) => {
                setStatusFilter(e.target.value);
                await fetchProjects(e.target.value, search);
              }}
            >
              <option value="">Status</option>
              <option value="WIP">WIP</option>
              <option value="Beta">Beta</option>
              <option value="Production">Production</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </section>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow border border-blue-100">
          <h3 className="text-lg font-semibold p-4 text-blue-700">Projects List</h3>
          <div className="min-w-full overflow-auto">
          <table className="w-full min-w-[1000px] text-sm text-center">
            <thead className="bg-blue-50 sticky top-0 z-10">
              <tr>
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Project Code</th>
                <th className="p-3 border">Project Name</th>
                <th className="p-3 border">URL</th>
                <th className="p-3 border">Server</th>
                <th className="p-3 border">Live Date</th>
                <th className="p-3 border">Hosting Amount</th>
                <th className="p-3 border">Hosting Start Date</th>
                <th className="p-3 border">Currency</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects
                .filter((p) => !statusFilter || p.status === statusFilter)
                .filter((p) => {
                  const code = p?.project_code?.toLowerCase() || '';
                  const name = p?.project_name?.toLowerCase() || '';
                  return code.includes(search.toLowerCase()) || name.includes(search.toLowerCase());
                })
                .map((p, idx) => (
                  <tr key={p.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                    <td className="p-2 border">{p.id}</td>
                    <td className="p-2 border">{p.project_code}</td>
                    <td className="p-2 border">{p.project_name}</td>
                    <td className="p-2 border">
                      {p.beta_url || p.production_url ? (
                        <a
                          href={p.beta_url || p.production_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {p.beta_url || p.production_url}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>

                    <td className="p-2 border">{p.beta_server || p.production_server}</td>
                    <td className="p-2 border">{p.live_date?.slice(0, 10)}</td>
                    <td className="p-2 border">{p.hosting_amount}</td>
                    <td className="p-2 border">{p.hosting_start_date?.slice(0, 10)}</td>
                    <td className="p-2 border">{p.currency}</td>
                    <td className="p-2 border">{p.status}</td>
                    <td className="p-2 border">
                      <div className="flex justify-center gap-2 cursor-pointer">
                        <button onClick={() => openEditModal(p)} title="Edit" className="text-blue-600 hover:text-blue-800 cursor-pointer">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => confirmDelete(p)} title="Delete" className="text-red-600 hover:text-red-800 cursor-pointer">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          </div>
        </div>

        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md mx-4 border border-red-100">
              <h2 className="text-xl font-semibold text-red-600 mb-4">Are you sure?</h2>
              <p className="text-gray-700 mb-6">
                Do you really want to delete project <strong>{projectToDelete?.project_name}</strong>?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition cursor-pointer"
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setProjectToDelete(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
                  onClick={performDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
