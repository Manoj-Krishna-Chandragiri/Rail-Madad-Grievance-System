import { 
  Headphones, 
  MessageSquare, 
  Phone, 
  Video, 
  Clock, 
  Users, 
  ChevronDown as ChevronDownIcon 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

interface SupportAgent {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'on-leave';
  activeChats?: number;
  expertise: string[];
  rating: number;
  email: string;
  phone: string;
}

interface ChatSession {
  id: string;
  user: string;
  agent: string;
  status: 'Active' | 'Waiting' | 'Completed';
  duration: string;
  type: 'Chat' | 'Voice' | 'Video';
  issue: string;
}

const RealTimeSupport = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [supportType, setSupportType] = useState<'chat' | 'voice' | 'video'>('chat');
  const [agents, setAgents] = useState<SupportAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const [displayAgentCount, setDisplayAgentCount] = useState<number>(4);

  const isDark = theme === 'dark';

  // Fetch staff data from backend
  useEffect(() => {
    const fetchStaffData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/complaints/staff/`);
        
        // Transform data to match SupportAgent interface
        const supportAgents = response.data.map((staff: any) => ({
          id: staff.id.toString(),
          name: staff.name,
          email: staff.email,
          phone: staff.phone,
          status: staff.status,
          // Random number of active chats for demo purposes
          activeChats: Math.floor(Math.random() * 4),
          // Parse expertise from JSON string if needed
          expertise: typeof staff.expertise === 'string' 
            ? JSON.parse(staff.expertise || '[]') 
            : (staff.expertise || []),
          rating: staff.rating || (3.5 + Math.random() * 1.5).toFixed(1)
        }));
        
        setAgents(supportAgents);
      } catch (err) {
        console.error('Error fetching staff data:', err);
        setError('Failed to load support agents. Please try again later.');
        
        // Fallback to default agents if API fails
        setAgents([
          {
            id: '1',
            name: 'Priya Singh',
            email: 'priya.singh@railmadad.in',
            phone: '+91 9876543210',
            status: 'active',
            activeChats: 2,
            expertise: ['Technical', 'Booking'],
            rating: 4.8
          },
          {
            id: '2',
            name: 'Rahul Kumar',
            email: 'rahul.kumar@railmadad.in',
            phone: '+91 9876543211',
            status: 'inactive',
            activeChats: 3,
            expertise: ['Refunds', 'General'],
            rating: 4.5
          },
          {
            id: '3',
            name: 'Anita Patel',
            email: 'anita.patel@railmadad.in',
            phone: '+91 9876543212',
            status: 'active',
            activeChats: 1,
            expertise: ['Technical', 'Security'],
            rating: 4.9
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, []);

  // Active sessions state - updated to use fetched staff and include more sessions
  const [activeSessions, setActiveSessions] = useState<ChatSession[]>([
    {
      id: '1',
      user: 'Amit Shah',
      agent: 'Priya Singh',
      status: 'Active',
      duration: '15:30',
      type: 'Chat',
      issue: 'Booking Assistance'
    },
    {
      id: '2',
      user: 'Meera Reddy',
      agent: 'Rahul Kumar',
      status: 'Waiting',
      duration: '00:45',
      type: 'Voice',
      issue: 'Refund Status'
    }
  ]);

  // Update sessions when staff data is loaded
  useEffect(() => {
    if (agents.length > 0) {
      // Create additional sessions with actual staff members
      const availableAgents = agents.filter(a => a.status === 'active');
      if (availableAgents.length > 0) {
        const newSessions: ChatSession[] = [
          // Keep existing sessions
          ...activeSessions,
        ];

        // Add new sessions based on available agents (if we have any new ones)
        if (availableAgents.length > 2 && activeSessions.length < 4) {
          const users = [
            'Vikram Sharma', 'Sunita Patel', 'Arun Kumar', 
            'Deepa Mehta', 'Rajesh Singh', 'Kavita Gupta'
          ];
          
          const issues = [
            'PNR Confirmation Query', 'Refund Delay', 'Cleanliness Issue',
            'Food Quality Complaint', 'AC Not Working', 'Security Concern'
          ];
          
          // Add 1-2 more sessions with randomly selected new agents
          for (let i = 0; i < Math.min(2, availableAgents.length - 2); i++) {
            if (i + 2 < availableAgents.length) { // Ensure we have enough agents
              const randomUserIndex = Math.floor(Math.random() * users.length);
              const randomIssueIndex = Math.floor(Math.random() * issues.length);
              const sessionType = ['Chat', 'Voice', 'Video'][Math.floor(Math.random() * 3)] as 'Chat' | 'Voice' | 'Video';
              
              // Create random duration (1-30 mins)
              const mins = Math.floor(Math.random() * 30) + 1;
              const secs = Math.floor(Math.random() * 60);
              const duration = `${mins}:${secs.toString().padStart(2, '0')}`;
              
              newSessions.push({
                id: (activeSessions.length + i + 1).toString(),
                user: users[randomUserIndex],
                agent: availableAgents[i + 2].name,
                status: Math.random() > 0.3 ? 'Active' : 'Waiting',
                duration: duration,
                type: sessionType,
                issue: issues[randomIssueIndex]
              });
            }
          }
          
          setActiveSessions(newSessions);
        }
      }
    }
  }, [agents]);

  // Calculate statistics based on real data
  const activeAgentsCount = agents.filter(a => a.status === 'active').length;
  const totalActiveSessions = activeSessions.length;
  const averageWaitTime = activeSessions.filter(s => s.status === 'Waiting')
    .reduce((acc, session) => {
      // Convert duration (mm:ss) to seconds
      const [mins, secs] = session.duration.split(':').map(Number);
      return acc + (mins * 60 + secs);
    }, 0);
  
  // Format average wait time
  const formatAverageWaitTime = () => {
    if (activeSessions.filter(s => s.status === 'Waiting').length === 0) 
      return '0:00';
    
    const avgSeconds = Math.floor(averageWaitTime / activeSessions.filter(s => s.status === 'Waiting').length);
    const minutes = Math.floor(avgSeconds / 60);
    const seconds = avgSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get display status for agent
  const getAgentDisplayStatus = (status: string) => {
    switch(status) {
      case 'active': return 'Available';
      case 'inactive': return 'Busy';
      case 'on-leave': return 'Offline';
      default: return 'Unknown';
    }
  };

  // Get status class for agent
  const getAgentStatusClass = (status: string) => {
    switch(status) {
      case 'active':
        return isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800';
      case 'inactive':
        return isDark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
      case 'on-leave':
        return isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
      default:
        return isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };

  const loadMoreAgents = () => {
    setDisplayAgentCount(prevCount => prevCount + 2);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <div className="flex items-center gap-3 mb-8">
          <Headphones className={`h-8 w-8 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h1 className="text-2xl font-semibold">Real-Time Support Center</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`${isDark ? 'bg-blue-900' : 'bg-blue-50'} p-6 rounded-lg`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold mb-2">Active Sessions</h3>
                <div className={`text-3xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  {activeSessions.length}
                </div>
              </div>
              <MessageSquare className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          </div>

          <div className={`${isDark ? 'bg-green-900' : 'bg-green-50'} p-6 rounded-lg`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold mb-2">Available Agents</h3>
                <div className={`text-3xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  {activeAgentsCount}
                </div>
              </div>
              <Users className={`h-6 w-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            </div>
          </div>

          <div className={`${isDark ? 'bg-yellow-900' : 'bg-yellow-50'} p-6 rounded-lg`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold mb-2">Avg. Wait Time</h3>
                <div className={`text-3xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                  {formatAverageWaitTime()}
                </div>
              </div>
              <Clock className={`h-6 w-6 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
              <h2 className="text-xl font-semibold mb-6">Active Support Sessions</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase`}>User</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase`}>Agent</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase`}>Status</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase`}>Duration</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase`}>Type</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase`}>Issue</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {activeSessions.map((session) => (
                      <tr key={session.id}>
                        <td className="px-6 py-4">{session.user}</td>
                        <td className="px-6 py-4">{session.agent}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              session.status === 'Active'
                                ? isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                                : isDark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {session.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">{session.duration}</td>
                        <td className="px-6 py-4">
                          {session.type === 'Chat' && <MessageSquare className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />}
                          {session.type === 'Voice' && <Phone className={`h-5 w-5 ${isDark ? 'text-green-400' : 'text-green-500'}`} />}
                          {session.type === 'Video' && <Video className={`h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />}
                        </td>
                        <td className="px-6 py-4">{session.issue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
              <h2 className="text-xl font-semibold mb-6">Start New Session</h2>
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                    Support Type
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {['chat', 'voice', 'video'].map((type) => (
                      <button
                        key={type}
                        className={`flex flex-col items-center p-4 rounded-lg border ${
                          supportType === type
                            ? isDark ? 'border-indigo-500 bg-indigo-900' : 'border-indigo-500 bg-indigo-50'
                            : isDark ? 'border-gray-700 hover:border-indigo-500' : 'border-gray-200 hover:border-indigo-500'
                        }`}
                        onClick={() => setSupportType(type as 'chat' | 'voice' | 'video')}
                      >
                        {type === 'chat' && <MessageSquare className="h-6 w-6 mb-2" />}
                        {type === 'voice' && <Phone className="h-6 w-6 mb-2" />}
                        {type === 'video' && <Video className="h-6 w-6 mb-2" />}
                        <span className="capitalize">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                    Select Agent (Optional)
                  </label>
                  
                  {loading ? (
                    <div className="py-4 flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : error ? (
                    <div className={`p-3 text-red-500 ${isDark ? 'bg-red-900/30' : 'bg-red-100'} rounded-lg`}>
                      {error}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {agents.slice(0, displayAgentCount).map((agent) => (
                        <div
                          key={agent.id}
                          className={`p-4 rounded-lg border cursor-pointer ${
                            selectedAgent === agent.id
                              ? isDark ? 'border-indigo-500 bg-indigo-900' : 'border-indigo-500 bg-indigo-50'
                              : isDark ? 'border-gray-700 hover:border-indigo-500' : 'border-gray-200 hover:border-indigo-500'
                          }`}
                          onClick={() => setSelectedAgent(agent.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">{agent.name}</h3>
                              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {agent.expertise.length > 0 
                                  ? agent.expertise.join(', ') 
                                  : 'General Support'}
                              </div>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getAgentStatusClass(agent.status)}`}
                            >
                              {getAgentDisplayStatus(agent.status)}
                            </span>
                          </div>
                          <div className={`mt-2 flex items-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            <span className="mr-4">Rating: {agent.rating}/5.0</span>
                            <span>Active Chats: {agent.activeChats || 0}</span>
                          </div>
                        </div>
                      ))}
                      
                      {agents.length > displayAgentCount && (
                        <button
                          onClick={loadMoreAgents}
                          className={`w-full p-3 text-center ${
                            isDark 
                              ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600' 
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200'
                          } rounded-lg flex items-center justify-center gap-2`}
                        >
                          <ChevronDownIcon className="h-5 w-5" />
                          Load More Agents
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700">
                  Start Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeSupport;