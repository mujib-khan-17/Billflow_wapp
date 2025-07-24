import React from 'react';

export default function BillingGeneration() {
  return (
    <div className="flex min-h-screen font-sans bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-6 font-bold text-xl border-b">Billflow</div>
        <nav className="flex flex-col mt-4">
          <button className="py-3 px-6 text-left hover:bg-gray-100">Dashboard</button>
          <button className="py-3 px-6 text-left hover:bg-gray-100">Projects</button>
          <button className="py-3 px-6 text-left bg-purple-200 font-semibold">Billing Generation</button>
          <button className="py-3 px-6 text-left hover:bg-gray-100">Billing History</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex justify-between items-center bg-gray-200 p-4 border-b">
          <h1 className="text-lg font-semibold">Billing Generation</h1>
          <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded">Logout</button>
        </div>

        {/* Form */}
        <div className="p-6 bg-white flex flex-col md:flex-row items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <label className="text-gray-700">Month</label>
            <input
              type="month"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="text-gray-700">Year</label>
            <input
              type="number"
              placeholder="2025"
              className="w-28 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md">
              Generate Billing
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
