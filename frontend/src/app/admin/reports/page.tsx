import React from 'react';

export default function ReportsPage() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Reports & Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">User Growth</h2>
          <div className="bg-white p-4 rounded border-l-4 border-blue-500">
            <p className="text-3xl font-bold text-gray-800">+15%</p>
            <p className="text-sm text-gray-500">Compared to last quarter</p>
          </div>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg border border-green-100">
          <h2 className="text-lg font-semibold text-green-800 mb-2">Event Attendance</h2>
          <div className="bg-white p-4 rounded border-l-4 border-green-500">
            <p className="text-3xl font-bold text-gray-800">+8%</p>
            <p className="text-sm text-gray-500">Compared to last quarter</p>
          </div>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
          <h2 className="text-lg font-semibold text-purple-800 mb-2">Revenue</h2>
          <div className="bg-white p-4 rounded border-l-4 border-purple-500">
            <p className="text-3xl font-bold text-gray-800">+23%</p>
            <p className="text-sm text-gray-500">Compared to last quarter</p>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">User Engagement</h2>
          <div className="bg-white p-4 rounded border-l-4 border-yellow-500">
            <p className="text-3xl font-bold text-gray-800">+11%</p>
            <p className="text-sm text-gray-500">Compared to last quarter</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Generate Reports</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select className="w-full border rounded px-3 py-2">
                <option>User Activity</option>
                <option>Event Performance</option>
                <option>Financial Summary</option>
                <option>Attendance Demographics</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select className="w-full border rounded px-3 py-2">
                <option>This Month</option>
                <option>Last Month</option>
                <option>This Quarter</option>
                <option>Last Quarter</option>
                <option>This Year</option>
                <option>Custom Range</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors w-full">
                Generate Report
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Export Options</h3>
            <div className="flex space-x-2">
              <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-50 transition-colors">
                Export as PDF
              </button>
              <button className="border border-green-500 text-green-500 px-4 py-2 rounded hover:bg-green-50 transition-colors">
                Export as CSV
              </button>
              <button className="border border-purple-500 text-purple-500 px-4 py-2 rounded hover:bg-purple-50 transition-colors">
                Export as Excel
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Reports</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <p className="font-medium">User Activity - Q2 2023</p>
              <p className="text-sm text-gray-500">Generated on June 30, 2023</p>
            </div>
            <div className="flex space-x-2">
              <button className="text-blue-600 hover:text-blue-900 text-sm">View</button>
              <button className="text-green-600 hover:text-green-900 text-sm">Download</button>
            </div>
          </div>
          {/* ... existing code ... */}
        </div>
      </div>
    </div>
  );
} 