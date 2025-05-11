import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle, ChevronDown, Check, ChevronDownIcon } from 'lucide-react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

interface Complaint {
  id: number;
  type: string;
  status: string;
  severity: string;
  date_of_incident: string;
  description: string;
  staff: string;
}

const getStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'in progress':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200';
    case 'closed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
    case 'open':
      return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200';
  }
};

const Dashboard = () => {
  const { theme } = useTheme();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Add pagination state
  const [displayCount, setDisplayCount] = useState<number>(25);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/complaints/user/`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      
      // Sort complaints by ID in descending order (newest first)
      const sortedComplaints = response.data.sort((a: Complaint, b: Complaint) => {
        return b.id - a.id; // Changed to sort by ID instead of date
      });
      
      setComplaints(sortedComplaints);
    } catch (error) {
      console.error('Error fetching complaints', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/complaints/${id}/`,
        { status: newStatus },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      
      // Update local state with new status
      setComplaints(prev =>
        prev.map(c =>
          c.id === id ? { ...c, status: newStatus } : c
        )
      );
      
      // Close dropdown
      setOpenDropdown(null);
    } catch (error) {
      console.error('Error updating status', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch =
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.staff?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || complaint.status === statusFilter;
    const matchesSeverity = severityFilter === 'All' || complaint.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  // Calculate complaint counts
  const openCount = complaints.filter(c => c.status === 'Open').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const closedCount = complaints.filter(c => c.status === 'Closed').length;

  // Function to load more complaints
  const loadMore = () => {
    setLoadingMore(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setDisplayCount(prevCount => prevCount + 10);
      setLoadingMore(false);
    }, 500);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm mb-2 text-gray-500">Open Complaints</h3>
              <div className="text-2xl font-bold">{openCount}</div>
            </div>
            <AlertTriangle className="text-red-500 h-8 w-8" />
          </div>
        </div>
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm mb-2 text-gray-500">In Progress</h3>
              <div className="text-2xl font-bold">{inProgressCount}</div>
            </div>
            <Clock className="text-yellow-500 h-8 w-8" />
          </div>
        </div>
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm mb-2 text-gray-500">Closed Complaints</h3>
              <div className="text-2xl font-bold">{closedCount}</div>
            </div>
            <CheckCircle className="text-green-500 h-8 w-8" />
          </div>
        </div>
      </div>

      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Complaints</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`px-4 py-2 border rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-4 py-2 border rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            >
              <option value="All">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className={`px-4 py-2 border rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            >
              <option value="All">All Severity</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Severity</th>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Description</th>
                <th className="text-left p-2">Staff</th>
                <th className="text-left p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && complaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-4">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredComplaints.length > 0 ? (
                <>
                  {filteredComplaints.slice(0, displayCount).map((complaint) => (
                    <tr key={complaint.id} className="border-t">
                      <td className="p-2">{complaint.id}</td>
                      <td className="p-2">{complaint.type}</td>
                      <td className="p-2">
                        <span className={`status-badge px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td className="p-2">{complaint.severity}</td>
                      <td className="p-2">{complaint.date_of_incident}</td>
                      <td className="p-2">{complaint.description}</td>
                      <td className="p-2">{complaint.staff || 'Unassigned'}</td>
                      <td className="p-2">
                        <div className="relative">
                          <button
                            onClick={() => setOpenDropdown(openDropdown === complaint.id ? null : complaint.id)}
                            className={`flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors ${
                              theme === 'dark' 
                                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                            } ${openDropdown === complaint.id ? 'ring-2 ring-indigo-400' : ''}`}
                            disabled={loading}
                          >
                            <span className={`w-2 h-2 rounded-full mr-1 
                              ${complaint.status === 'Open' ? 'bg-red-500' : 
                                complaint.status === 'In Progress' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                            {complaint.status}
                            <ChevronDown className="h-3 w-3 ml-1" />
                          </button>
                          
                          {openDropdown === complaint.id && (
                            <div className={`absolute top-full left-0 mt-1 py-1 rounded-md shadow-lg z-10 min-w-[120px] ${
                              theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'
                            }`}>
                              {['Open', 'In Progress', 'Closed'].map(status => (
                                <div 
                                  key={status}
                                  className={`px-3 py-1.5 text-sm cursor-pointer flex items-center gap-2 
                                    ${complaint.status === status 
                                      ? theme === 'dark' ? 'bg-gray-700 text-indigo-400' : 'bg-indigo-50 text-indigo-700' 
                                      : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                                  onClick={() => handleStatusChange(complaint.id, status)}
                                >
                                  <span className={`w-2 h-2 rounded-full 
                                    ${status === 'Open' ? 'bg-red-500' : 
                                      status === 'In Progress' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                                  {status}
                                  {complaint.status === status && (
                                    <Check className="h-3 w-3 ml-auto" />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td colSpan={8} className="text-center p-4">
                    No complaints found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Load More button */}
          {filteredComplaints.length > displayCount && (
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                {loadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <ChevronDownIcon className="h-5 w-5" />
                    <span>Load More</span>
                  </>
                )}
              </button>
            </div>
          )}
          
          {/* Show count information */}
          <div className={`text-center mt-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Showing {Math.min(displayCount, filteredComplaints.length)} of {filteredComplaints.length} complaints
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;