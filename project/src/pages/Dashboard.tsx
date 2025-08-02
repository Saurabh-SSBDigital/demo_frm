import React from 'react';
import DataTable from '../components/DataTable';
import { TrendingUp, Users, DollarSign, AlertTriangle } from 'lucide-react';
import Loader from '../components/Loader';

const Dashboard: React.FC = () => {
  const [statsLoading, setStatsLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    totalRecords: 0,
    totalOutstanding: 0,
    totalIrregularity: 0,
    averageOutstanding: 0
  });

  // Fetch summary statistics
  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        // You can create a separate API endpoint for statistics
        // For now, we'll simulate loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock statistics - replace with actual API call
        setStats({
          totalRecords: 1250,
          totalOutstanding: 15750000,
          totalIrregularity: 125000,
          averageOutstanding: 12600
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsConfig = [
    {
      name: 'Total Records',
      value: stats.totalRecords.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Total Outstanding',
      value: new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(stats.totalOutstanding),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Average Outstanding',
      value: new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(stats.averageOutstanding),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Total Irregularity',
      value: new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(stats.totalIrregularity),
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      {/* <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of PACS account data and member information
        </p>
      </div> */}

      {/* Statistics Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              {statsLoading ? (
                <div className="flex items-center justify-center h-20">
                  <Loader size="sm" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div> */}

      {/* Data Table */}
      <DataTable apiUrl="http://192.168.1.87:8080/pacs/all" />
    </div>
  );
};

export default Dashboard;