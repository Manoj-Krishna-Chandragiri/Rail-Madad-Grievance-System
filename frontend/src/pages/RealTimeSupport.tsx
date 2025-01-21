import { Headphones, MessageSquare, Phone, Video, Clock, Users } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface SupportAgent {
  id: string;
  name: string;
  status: 'Available' | 'Busy' | 'Offline';
  activeChats: number;
  expertise: string[];
  rating: number;
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
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const agents: SupportAgent[] = [
    {
      id: '1',
      name: 'Priya Singh',
      status: 'Available',
      activeChats: 2,
      expertise: ['Technical', 'Booking'],
      rating: 4.8
    },
    {
      id: '2',
      name: 'Rahul Kumar',
      status: 'Busy',
      activeChats: 3,
      expertise: ['Refunds', 'General'],
      rating: 4.5
    },
    {
      id: '3',
      name: 'Anita Patel',
      status: 'Available',
      activeChats: 1,
      expertise: ['Technical', 'Security'],
      rating: 4.9
    }
  ];

  const activeSessions: ChatSession[] = [
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
  ];

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
                <div className={`text-3xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>24</div>
              </div>
              <MessageSquare className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          </div>

          <div className={`${isDark ? 'bg-green-900' : 'bg-green-50'} p-6 rounded-lg`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold mb-2">Available Agents</h3>
                <div className={`text-3xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>8</div>
              </div>
              <Users className={`h-6 w-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            </div>
          </div>

          <div className={`${isDark ? 'bg-yellow-900' : 'bg-yellow-50'} p-6 rounded-lg`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold mb-2">Avg. Wait Time</h3>
                <div className={`text-3xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>2:30</div>
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
                  <div className="space-y-2">
                    {agents.map((agent) => (
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
                              {agent.expertise.join(', ')}
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              agent.status === 'Available'
                                ? isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                                : agent.status === 'Busy'
                                ? isDark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                                : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {agent.status}
                          </span>
                        </div>
                        <div className={`mt-2 flex items-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          <span className="mr-4">Rating: {agent.rating}/5.0</span>
                          <span>Active Chats: {agent.activeChats}</span>
                        </div>
                      </div>
                    ))}
                  </div>
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