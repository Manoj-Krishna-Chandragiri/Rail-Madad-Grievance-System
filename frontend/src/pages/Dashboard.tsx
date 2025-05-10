import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
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

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/complaints/user/`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setComplaints(response.data);
      } catch (error) {
        console.error('Error fetching complaints', error);
      }
    };

    fetchComplaints();
  }, []);

  const handleStatusChange = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/complaints/${id}/`,
        { status: 'Closed' },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setComplaints(prev =>
        prev.map(c =>
          c.id === id ? { ...c, status: 'Closed' } : c
        )
      );
    } catch (error) {
      console.error('Error updating status', error);
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

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm mb-2 text-gray-500">Open Complaints</h3>
              <div className="text-2xl font-bold">{complaints.filter(c => c.status === 'Open').length}</div>
            </div>
            <AlertTriangle className="text-red-500 h-8 w-8" />
          </div>
        </div>
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm mb-2 text-gray-500">In Progress</h3>
              <div className="text-2xl font-bold">{complaints.filter(c => c.status === 'In Progress').length}</div>
            </div>
            <Clock className="text-yellow-500 h-8 w-8" />
          </div>
        </div>
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm mb-2 text-gray-500">Closed Complaints</h3>
              <div className="text-2xl font-bold">{complaints.filter(c => c.status === 'Closed').length}</div>
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
              className="px-4 py-2 border rounded"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded"
            >
              <option value="All">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-4 py-2 border rounded"
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
              {filteredComplaints.map(complaint => (
                <tr key={complaint.id} className="border-t">
                  <td className="p-2">{complaint.id}</td>
                  <td className="p-2">{complaint.type}</td>
                  <td className="p-2">
                    <span className={`status-badge ${getStatusBadgeClass(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="p-2">{complaint.severity}</td>
                  <td className="p-2">{complaint.date_of_incident}</td>
                  <td className="p-2">{complaint.description}</td>
                  <td className="p-2">{complaint.staff || 'Unassigned'}</td>
                  <td className="p-2">
                    {complaint.status !== 'Closed' && (
                      <button
                        onClick={() => handleStatusChange(complaint.id)}
                        className="bg-green-600 text-white px-2 py-1 rounded"
                      >
                        Mark as Closed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;