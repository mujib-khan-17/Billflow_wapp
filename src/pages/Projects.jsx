import React from 'react';

export default function ProjectManagement() {
  return (
    <div className="flex min-h-screen font-sans bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-6 font-bold text-xl border-b">Billflow</div>
        <nav className="flex flex-col mt-4">
          <button className="py-3 px-6 text-left hover:bg-gray-100">Dashboard</button>
          <button className="py-3 px-6 text-left bg-gray-200 font-semibold">Projects</button>
          <button className="py-3 px-6 text-left hover:bg-gray-100">Billing Generation</button>
          <button className="py-3 px-6 text-left hover:bg-gray-100">Billing History</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex justify-between items-center bg-gray-200 p-4 border-b">
          <h1 className="text-lg font-semibold">Project Management</h1>
          <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded">Logout</button>
        </div>

        {/* Filters and Add Project */}
        <div className="p-4 flex flex-col md:flex-row justify-between gap-4 bg-white shadow">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
            Add Project
          </button>
        </div>

        {/* Table */}
        <div className="p-4 overflow-x-auto">
          <table className="w-full bg-white border border-gray-300 shadow">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Project Code</th>
                <th className="p-3 border">Project Name</th>
                <th className="p-3 border">URL</th>
                <th className="p-3 border">Server</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody className="text-center text-sm">
              {/* Dummy row */}
              <tr>
                <td className="p-2 border">1</td>
                <td className="p-2 border">PRJ001</td>
                <td className="p-2 border">CRM System</td>
                <td className="p-2 border">https://beta.example.com</td>
                <td className="p-2 border">Server A</td>
                <td className="p-2 border">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Active</span>
                </td>
                <td className="p-2 border space-x-2">
                  <button className="text-blue-600 hover:underline">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
              {/* Add more rows dynamically */}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center py-4">
          <button className="px-4 py-1 mx-1 bg-gray-300 rounded hover:bg-gray-400">Previous</button>
          <button className="px-4 py-1 mx-1 bg-blue-600 text-white rounded">1</button>
          <button className="px-4 py-1 mx-1 bg-gray-300 rounded hover:bg-gray-400">Next</button>
        </div>
      </main>
    </div>
  );
}
