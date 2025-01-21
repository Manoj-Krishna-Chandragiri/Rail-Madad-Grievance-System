import { useState } from 'react';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Complaint {
  id: number;
  type: string;
  status: string;
  severity: string;
  date: string;
  description: string;
  staff: string;
}

const complaints: Complaint[] = [
  {
    id: 1,
    type: 'Housekeeping',
    status: 'Open',
    severity: 'Medium',
    date: '2024-09-24',
    description: 'A common grievance regarding Indian train toilets is the lack of cleanliness and proper hygiene maintenance.',
    staff: 'Unassigned'
  },
  {
    id: 2,
    type: 'Cleanliness',
    status: 'Closed',
    severity: 'Low',
    date: '2024-09-24',
    description: 'Unclean compartment',
    staff: 'John Doe'
  },
  {
    id: 3,
    type: 'Staff Behavior',
    status: 'In Progress',
    severity: 'High',
    date: '2024-09-23',
    description: 'Rude staff member',
    staff: 'Jane Smith'
  }
];

const Dashboard = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.staff.toLowerCase().includes(searchTerm.toLowerCase());

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
              <h3 className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>Open Complaints</h3>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>3</div>
              <div className="text-green-500 text-sm">+2% from last month</div>
            </div>
            <AlertTriangle className={`${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-700'} h-8 w-8`} />
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>In Progress</h3>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>1</div>
              <div className="text-red-500 text-sm">-5% from last month</div>
            </div>
            <Clock className="text-yellow-400 h-8 w-8" />
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>Closed Complaints</h3>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>2</div>
              <div className="text-green-500 text-sm">+10% from last month</div>
            </div>
            <CheckCircle className="text-green-500 h-8 w-8" />
          </div>
        </div>
      </div>

      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Recent Complaints</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search complaints..."
              className={`px-4 py-2 border rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'border-gray-300'
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className={`px-4 py-2 border rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'border-gray-300'
              }`}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
            <select
              className={`px-4 py-2 border rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'border-gray-300'
              }`}
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
            >
              <option value="All">All Severity</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`text-left p-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>ID</th>
                <th className={`text-left p-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Type</th>
                <th className={`text-left p-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Status</th>
                <th className={`text-left p-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Severity</th>
                <th className={`text-left p-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Date</th>
                <th className={`text-left p-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Description</th>
                <th className={`text-left p-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Assigned Staff</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((complaint) => (
                <tr key={complaint.id} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <td className={`p-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>{complaint.id}</td>
                  <td className={`p-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>{complaint.type}</td>
                  <td className="p-4">
                    <span className={`status-badge ${complaint.status.toLowerCase()}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`severity-badge ${complaint.severity.toLowerCase()}`}>
                      {complaint.severity}
                    </span>
                  </td>
                  <td className={`p-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>{complaint.date}</td>
                  <td className={`p-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>{complaint.description}</td>
                  <td className={`p-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>{complaint.staff}</td>
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