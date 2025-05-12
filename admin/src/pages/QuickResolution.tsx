import { Zap, Search, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Solution {
  id: string;
  problem: string;
  solution: string;
  category: string;
  resolution_time: string;
  success_rate: number;
}

// Simplified version of the frontend component using the admin ThemeContext
const QuickResolution = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  // Sample solutions data
  const solutions: Solution[] = [
    {
      id: '1',
      problem: 'PNR Status Not Updating',
      solution: '1. Clear browser cache\n2. Wait for 15 minutes\n3. Try refreshing the page\n4. Contact support if issue persists',
      category: 'Unreserved / Reserved Ticketing',
      resolution_time: '5 mins',
      success_rate: 92
    },
    {
      id: '2',
      problem: 'Refund Not Processed',
      solution: '1. Check bank account details\n2. Verify cancellation status\n3. Wait for 5-7 business days\n4. Raise ticket if delayed',
      category: 'Refund of Tickets',
      resolution_time: '7 days',
      success_rate: 85
    }
  ];

  const filteredSolutions = solutions.filter(solution => {
    const matchesSearch = 
      solution.problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solution.solution.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || solution.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <div className="flex items-center gap-3 mb-8">
          <Zap className="h-8 w-8 text-indigo-400" />
          <h1 className="text-2xl font-semibold">Quick Resolution Center</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`${isDark ? 'bg-green-900' : 'bg-green-50'} p-6 rounded-lg`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
                <div className={`text-3xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>88.5%</div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Last 30 days</p>
              </div>
              <CheckCircle className={`h-6 w-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            </div>
          </div>

          {/* Additional stats would go here */}
        </div>

        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for solutions..."
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {/* Category select would go here */}
          </div>
        </div>

        {/* Solutions list would go here */}
      </div>
    </div>
  );
};

export default QuickResolution;
