import { Zap, Search, CheckCircle, Clock, AlertTriangle, MessageSquare, FileText } from 'lucide-react';
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

const QuickResolution = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { theme } = useTheme();

  const isDark = theme === 'dark';

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
    },
    {
      id: '3',
      problem: 'Seat Not Allocated',
      solution: '1. Check PNR status\n2. Verify booking confirmation\n3. Contact TTE\n4. Visit help desk',
      category: 'Passenger Amenities',
      resolution_time: '30 mins',
      success_rate: 88
    }
  ];

  const categories = [
    'Coach - Maintenance/Facilities',
    'Electrical Equipment',
    'Medical Assistance',
    'Catering / Vending Services',
    'Passengers Behaviour',
    'Water Availability',
    'Punctuality',
    'Security',
    'Unreserved / Reserved Ticketing',
    'Coach - Cleanliness',
    'Staff Behaviour',
    'Refund of Tickets',
    'Passenger Amenities',
    'Bed Roll',
    'Corruption / Bribery',
    'Miscellaneous'
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

          <div className={`${isDark ? 'bg-blue-900' : 'bg-blue-50'} p-6 rounded-lg`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold mb-2">Avg. Resolution Time</h3>
                <div className={`text-3xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>4.2h</div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>This week</p>
              </div>
              <Clock className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          </div>

          <div className={`${isDark ? 'bg-yellow-900' : 'bg-yellow-50'} p-6 rounded-lg`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold mb-2">Pending Issues</h3>
                <div className={`text-3xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>23</div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Requires attention</p>
              </div>
              <AlertTriangle className={`h-6 w-6 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
            </div>
          </div>
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
            <select
              className={`px-4 py-2 border rounded-lg ${
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredSolutions.length > 0 ? (
            filteredSolutions.map((solution) => (
              <div key={solution.id} className={`border rounded-lg p-6 hover:shadow-md transition-shadow ${
                isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{solution.problem}</h3>
                    <span className={`px-2 py-1 ${
                      isDark ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800'
                    } text-sm rounded-full`}>
                      {solution.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Resolution Time</div>
                    <div className="font-semibold">{solution.resolution_time}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Solution Steps:</h4>
                  <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
                    {solution.solution.split('\n').map((step, index) => (
                      <div key={index} className="flex items-start gap-2 mb-2">
                        <div className="min-w-[20px]">{step.split('.')[0]}.</div>
                        <div>{step.split('.')[1]}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Success Rate:</div>
                    <div className={`font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      {solution.success_rate}%
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Apply Solution
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No solutions found matching your search.</p>
            </div>
          )}
        </div>

        <div className={`mt-8 p-6 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
          <h2 className="text-xl font-semibold mb-4">Need More Help?</h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            If you couldn't find a solution to your problem, you can:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className={`flex items-center justify-center gap-2 px-4 py-2 ${
              isDark ? 'bg-gray-800 text-indigo-400 border-indigo-500 hover:bg-gray-700' : 
              'bg-white border-indigo-600 text-indigo-600 hover:bg-indigo-50'
            } border rounded-lg`}>
              <MessageSquare className="h-5 w-5" />
              Contact Support
            </button>
            <button className={`flex items-center justify-center gap-2 px-4 py-2 ${
              isDark ? 'bg-gray-800 text-indigo-400 border-indigo-500 hover:bg-gray-700' : 
              'bg-white border-indigo-600 text-indigo-600 hover:bg-indigo-50'
            } border rounded-lg`}>
              <FileText className="h-5 w-5" />
              Submit Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickResolution;