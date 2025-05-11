import { Clock, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

interface ComplaintStatus {
  id: string;
  pnr: string;
  status: string;
  lastUpdated: string;
  description: string;
  assignedTo: string;
}

const TrackStatus = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [complaints, setComplaints] = useState<ComplaintStatus[]>([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/complaints/list/`
        );

        const formatted = response.data.map((item: any) => ({
          id: `CMP${item.id.toString().padStart(3, '0')}`,
          pnr: item.pnr_number || 'N/A',
          status: item.status === 'Closed' ? 'Resolved' : item.status,
          lastUpdated: item.date_of_incident,
          description: item.description,
          assignedTo: item.staff || 'Unassigned',
        }));

        setComplaints(formatted);
      } catch (error) {
        console.error('Failed to fetch complaints:', error);
      }
    };

    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter((complaint) =>
    complaint.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.pnr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div
        className={`${
          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'
        } rounded-lg shadow-lg p-6`}
      >
        <div className="flex items-center gap-3 mb-8">
          <Clock className="h-8 w-8 text-indigo-400" />
          <h1 className="text-2xl font-semibold">Track Complaint Status</h1>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Complaint ID or PNR number..."
              className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className={`${
                  theme === 'dark' ? 'border-gray-700 bg-gray-700' : 'border'
                } rounded-lg p-6`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Complaint ID: {complaint.id}
                    </h3>
                    <p
                      className={
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      }
                    >
                      PNR: {complaint.pnr}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      complaint.status === 'Resolved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {complaint.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <p
                    className={
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }
                  >
                    <span className="font-medium">Description:</span>{' '}
                    {complaint.description}
                  </p>
                  <p
                    className={
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }
                  >
                    <span className="font-medium">Assigned To:</span>{' '}
                    {complaint.assignedTo}
                  </p>
                  <p
                    className={
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }
                  >
                    <span className="font-medium">Last Updated:</span>{' '}
                    {complaint.lastUpdated}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p
                className={
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }
              >
                No complaints found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackStatus;