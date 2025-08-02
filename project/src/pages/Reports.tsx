import React from 'react';
import { FileText, Download, Calendar, Filter } from 'lucide-react';

const Reports: React.FC = () => {
  const reportTypes = [
    {
      id: 1,
      title: 'Outstanding Summary Report',
      description: 'Comprehensive summary of all outstanding amounts by PACS',
      lastGenerated: '2025-01-08',
      status: 'Ready',
      format: 'PDF',
    },
    {
      id: 2,
      title: 'Member Irregularity Report',
      description: 'Detailed analysis of member account irregularities',
      lastGenerated: '2025-01-07',
      status: 'Processing',
      format: 'Excel',
    },
    {
      id: 3,
      title: 'Interest Accrual Report',
      description: 'Monthly interest accrual across all member accounts',
      lastGenerated: '2025-01-05',
      status: 'Ready',
      format: 'PDF',
    },
    {
      id: 4,
      title: 'Due Date Analysis',
      description: 'Analysis of upcoming and overdue payment schedules',
      lastGenerated: '2025-01-03',
      status: 'Ready',
      format: 'Excel',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-2">
          Generate and download various financial reports and analytics
        </p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FileText className="w-4 h-4 mr-2" />
            Generate New Report
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Report
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Custom Filter
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Available Reports</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {reportTypes.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                    <span>Last generated: {report.lastGenerated}</span>
                    <span>Format: {report.format}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      report.status === 'Ready' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    disabled={report.status !== 'Ready'}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Outstanding Trends</h2>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Chart visualization would be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;