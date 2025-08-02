import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { DataItem } from '../data/dummyData';
import { useApi } from '../hooks/useApi';
import Loader from './Loader';

interface DataTableProps {
  apiUrl?: string;
  data?: DataItem[];
}

const DataTable: React.FC<DataTableProps> = ({ apiUrl, data: staticData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
  const [searchDebounce, setSearchDebounce] = useState('');

  // Debounce search term
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Use API hook if apiUrl is provided, otherwise use static data
  const { data: apiData, loading, error, refetch } = useApi<DataItem>(
    apiUrl || '', 
    currentPage - 1, // API uses 0-based indexing
    itemsPerPage, 
    searchDebounce
  );

  // Determine data source and pagination info
  const isUsingApi = !!apiUrl;
  const paginatedData = isUsingApi ? (apiData?.content || []) : (staticData || []);
  const totalPages = isUsingApi ? (apiData?.totalPages || 0) : Math.ceil((staticData?.length || 0) / itemsPerPage);
  const totalElements = isUsingApi ? (apiData?.totalElements || 0) : (staticData?.length || 0);
  const startIndex = isUsingApi ? (currentPage - 1) * itemsPerPage : 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(num);
  };

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header with search and filters */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">PACS Account Data</h2>
            <p className="text-sm text-gray-600 mt-1">
              {loading ? 'Loading...' : `Showing ${paginatedData.length} of ${totalElements} records`}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            
            {/* Items per page selector */}
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              disabled={loading}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
            
            {isUsingApi && (
              <button
                onClick={refetch}
                disabled={loading}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-12">
          <Loader size="lg" text="Loading data..." />
        </div>
      )}

      {/* Desktop table view */}
      {!loading && (
        <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PACS Name</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account No</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Name</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outstanding</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {startIndex + index + 1}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-w-xs truncate" title={item.pacsName}>
                    {item.pacsName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.memberAccountNo}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {item.memberAccountName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span className={`${parseFloat(item.memberOutstanding) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(item.memberOutstanding)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.memberDueDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="text-blue-600 hover:text-blue-900 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {/* Mobile card view */}
      {!loading && (
        <div className="lg:hidden">
        {paginatedData.map((item, index) => (
          <div key={item.id} className="p-4 border-b border-gray-200 last:border-b-0">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  #{startIndex + index + 1} - {item.memberAccountName}
                </h3>
                <p className="text-xs text-gray-600 mt-1 truncate">
                  {item.pacsName}
                </p>
              </div>
              <button
                onClick={() => setSelectedItem(item)}
                className="text-blue-600 hover:text-blue-900 transition-colors p-2 hover:bg-blue-50 rounded-lg"
              >
                <Eye size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-500">Account No:</span>
                <p className="font-medium text-gray-900">{item.pacsAccountNo}</p>
              </div>
              <div>
                <span className="text-gray-500">Outstanding:</span>
                <p className={`font-medium ${parseFloat(item.memberOutstanding) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(item.memberOutstanding)}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Due Date:</span>
                <p className="font-medium text-gray-900">{item.memberDueDate}</p>
              </div>
              <div>
                <span className="text-gray-500">Branch:</span>
                <p className="font-medium text-gray-900">{item.brNo}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalElements)} of {totalElements} results
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Page info */}
              <span className="text-sm text-gray-600 mr-4">
                Page {currentPage} of {totalPages}
              </span>
              
              {/* Pagination controls */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
                <span className="ml-1 hidden sm:inline">Previous</span>
              </button>
              
              {/* Page numbers - show only on larger screens */}
              <div className="hidden sm:flex items-center space-x-1">
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                  let page;
                  if (totalPages <= 5) {
                    page = index + 1;
                  } else if (currentPage <= 3) {
                    page = index + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + index;
                  } else {
                    page = currentPage - 2 + index;
                  }
                  
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium border transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="mr-1 hidden sm:inline">Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Account Details</h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* PACS Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">PACS Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">PACS Name</label>
                    <p className="text-gray-900">{selectedItem.pacsName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Number</label>
                    <p className="text-gray-900">{selectedItem.pacsAccountNo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Limit Sanctioned</label>
                    <p className="text-gray-900">{formatCurrency(selectedItem.limitSanctioned)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Outstanding Amount</label>
                    <p className="text-red-600 font-medium">{formatCurrency(selectedItem.outstandingAmount)}</p>
                  </div>
                </div>
              </div>

              {/* Member Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Member Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Member Name</label>
                    <p className="text-gray-900">{selectedItem.memberAccountName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Member Account No</label>
                    <p className="text-gray-900">{selectedItem.memberAccountNo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Member Outstanding</label>
                    <p className="text-red-600 font-medium">{formatCurrency(selectedItem.memberOutstanding)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Due Date</label>
                    <p className="text-gray-900">{selectedItem.memberDueDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;