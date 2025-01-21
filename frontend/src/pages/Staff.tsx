import { Users, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  status: string;
  activeComplaints: number;
  resolvedComplaints: number;
}

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [staffMembers] = useState<StaffMember[]>([
    {
      id: 'STF001',
      name: 'Rahul Kumar',
      role: 'Senior Technical Officer',
      department: 'Technical',
      status: 'Active',
      activeComplaints: 3,
      resolvedComplaints: 45
    },
    {
      id: 'STF002',
      name: 'Priya Singh',
      role: 'Customer Support Lead',
      department: 'Support',
      status: 'Active',
      activeComplaints: 5,
      resolvedComplaints: 38
    }
  ]);

  const filteredStaff = staffMembers.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <div className="flex items-center gap-3 mb-8">
          <Users className="h-8 w-8 text-indigo-400" />
          <h1 className="text-2xl font-semibold">Staff Management</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff members..."
                className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Filter className="h-5 w-5" />
            Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStaff.length > 0 ? (
            filteredStaff.map((staff) => (
              <div key={staff.id} className={`border ${
                isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200'
              } rounded-lg p-6`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{staff.name}</h3>
                    <p className={isDark ? 'text-gray-300' : 'text-gray-500'}>{staff.role}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    staff.status === 'Active' 
                      ? isDark ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800'
                      : isDark ? 'bg-gray-600 text-gray-100' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {staff.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <p><span className="font-medium">Department:</span> {staff.department}</p>
                  <p><span className="font-medium">Active Complaints:</span> {staff.activeComplaints}</p>
                  <p><span className="font-medium">Resolved Complaints:</span> {staff.resolvedComplaints}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    View Details
                  </button>
                  <button className={`px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg ${
                    isDark ? 'hover:bg-gray-600' : 'hover:bg-indigo-50'
                  }`}>
                    Edit
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8">
              <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                No staff members found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Staff;