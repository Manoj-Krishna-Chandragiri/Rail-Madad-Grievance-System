import { 
  Headphones, 
  MessageSquare, 
  Phone, 
  Video, 
  Clock, 
  Users, 
  ChevronDown as ChevronDownIcon,
  Filter,
  Star,
  CheckCircle,
  RefreshCw,
  Activity,
  Calendar,
  Zap,
  PieChart
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
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
  avatar?: string;
  availability?: number[];
  communication_preferences?: string[]; // Add this field
}

interface ChatSession {
  id: string;
  user: string;
  agent: string;
  status: 'Active' | 'Waiting' | 'Completed';
  duration: string;
  type: 'Chat' | 'Voice' | 'Video';
  issue: string;
  messages?: {
    sender: 'user' | 'agent';
    text: string;
    time: string;
  }[];
  priority?: 'low' | 'medium' | 'high';
}

const RealTimeSupport = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [supportType, setSupportType] = useState<'chat' | 'voice' | 'video'>('chat');
  const [agents, setAgents] = useState<SupportAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const [displayAgentCount, setDisplayAgentCount] = useState<number>(4);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [issue, setIssue] = useState('');
  const [isAgentHovered, setIsAgentHovered] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const [commPrefFilter, setCommPrefFilter] = useState<string>('all');

  const isDark = theme === 'dark';

  // Fetch staff data from backend with proper session handling
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
          activeChats: staff.active_tickets || 0,
          expertise: typeof staff.expertise === 'string' 
            ? JSON.parse(staff.expertise || '[]') 
            : (staff.expertise || []),
          rating: staff.rating || 4.0,
          avatar: processAvatarUrl(staff.avatar, staff.name),
          communication_preferences: typeof staff.communication_preferences === 'string' 
            ? JSON.parse(staff.communication_preferences || '["Chat"]') 
            : (staff.communication_preferences || ['Chat']),
        }));
        
        setAgents(supportAgents);
        
        // Create active sessions based on available agents
        if (supportAgents.length > 0) {
          createActiveSessions(supportAgents);
        }
      } catch (err) {
        console.error('Error fetching staff data:', err);
        setError('Failed to load support agents. Please try again later.');
        
        // Set a fallback agent list if the API fails
        setAgents([
          {
            id: '1',
            name: 'Priya Singh',
            email: 'priya.singh@railmadad.in',
            phone: '+919876543210', // Format without spaces for WhatsApp
            status: 'active',
            activeChats: 2,
            expertise: ['Technical', 'Booking'],
            rating: 4.8,
            avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
            communication_preferences: ['Chat', 'Voice', 'Video'],
          },
          {
            id: '2',
            name: 'Rahul Kumar',
            email: 'rahul.kumar@railmadad.in',
            phone: '+91 9876543211',
            status: 'inactive',
            activeChats: 3,
            expertise: ['Refunds', 'General'],
            rating: 4.5,
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            availability: [1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0],
            communication_preferences: ['Chat', 'Voice'],
          },
          {
            id: '3',
            name: 'Anita Patel',
            email: 'anita.patel@railmadad.in',
            phone: '+91 9876543212',
            status: 'active',
            activeChats: 1,
            expertise: ['Technical', 'Security'],
            rating: 4.9,
            avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
            availability: [4, 5, 6, 7, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1, 0, 1],
            communication_preferences: ['Chat', 'Video'],
          }
        ]);
        createActiveSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, []);

  // Function to process avatar URLs
  const processAvatarUrl = (avatarPath: string | null, staffName: string): string => {
    if (!avatarPath) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(staffName)}&background=random`;
    }
    
    // Handle external URLs
    if (avatarPath.includes('randomuser.me') || avatarPath.includes('http://') || avatarPath.includes('https://')) {
      if (!avatarPath.startsWith('http')) {
        return `https:${avatarPath}`;
      }
      return avatarPath;
    }
    
    // Local/uploaded images
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
    
    if (avatarPath.startsWith('/media/')) {
      return `${apiBaseUrl}${avatarPath}`;
    } else if (avatarPath.startsWith('media/')) {
      return `${apiBaseUrl}/${avatarPath}`;
    } else {
      return `${apiBaseUrl}/media/${avatarPath}`;
    }
  };

  // Simulate real-time with messages
  const [activeSessions, setActiveSessions] = useState<ChatSession[]>([]);

  // Function to create realistic sessions based on available agents
  const createActiveSessions = (availableAgents: SupportAgent[]) => {
    const activeAgents = availableAgents.filter(a => a.status === 'active');
    
    // If no agents are available, use defaults
    if (activeAgents.length === 0) {
      setActiveSessions([
        {
          id: '1',
          user: 'Amit Shah',
          agent: 'Priya Singh',
          status: 'Active',
          duration: '15:30',
          type: 'Chat',
          issue: 'Booking Assistance',
          priority: 'medium',
          messages: [
            { sender: 'user', text: 'I booked a ticket but it shows waiting list. Can you help?', time: '15:10' },
            { sender: 'agent', text: 'I understand your concern. Let me check the status of your booking.', time: '15:12' },
            { sender: 'agent', text: 'Could you please share your PNR number?', time: '15:12' },
            { sender: 'user', text: '4528167359', time: '15:15' },
            { sender: 'agent', text: 'Thank you. I can see your booking is currently WL 15. The chances of confirmation look good based on historical data.', time: '15:18' }
          ]
        },
        {
          id: '2',
          user: 'Meera Reddy',
          agent: 'Rahul Kumar',
          status: 'Waiting',
          duration: '00:45',
          type: 'Voice',
          issue: 'Refund Status',
          priority: 'high',
          messages: [
            { sender: 'user', text: 'I cancelled my ticket 10 days ago but still no refund', time: '00:30' },
            { sender: 'agent', text: 'I apologize for the delay. Let me look into this right away.', time: '00:35' }
          ]
        },
        // Add the specific sessions requested
        {
          id: '3',
          user: 'Rajesh Singh',
          agent: 'Akash',
          status: 'Waiting',
          duration: '30:45',
          type: 'Chat',
          issue: 'PNR Confirmation Query',
          priority: 'medium',
          messages: [
            { sender: 'user', text: 'Can you tell me the current status of my PNR?', time: '30:30' },
            { sender: 'agent', text: 'Please share your PNR number and I\'ll check it for you.', time: '30:40' }
          ]
        },
        {
          id: '4',
          user: 'Arun Kumar',
          agent: 'Dinesh',
          status: 'Waiting',
          duration: '21:30',
          type: 'Video',
          issue: 'Refund Delay',
          priority: 'high',
          messages: [
            { sender: 'user', text: 'My refund has been pending for 15 days now', time: '21:15' },
            { sender: 'agent', text: 'I\'ll check the status and expedite it for you', time: '21:25' }
          ]
        }
      ]);
      return;
    }
    
    // Users and issues
    const users = [
      'Amit Shah', 'Meera Reddy', 'Rajesh Singh', 'Arun Kumar', 
      'Deepa Mehta', 'Vikram Sharma', 'Sunita Patel', 'Kavita Gupta'
    ];
    
    const issues = [
      'Booking Assistance', 'Refund Status', 'PNR Confirmation Query', 'Refund Delay',
      'Food Quality Complaint', 'AC Not Working', 'Security Concern', 'Platform Change Information'
    ];
    
    // Create sessions with real agents from database
    const sessions: ChatSession[] = [];
    
    // First add the 4 specific sessions requested
    if (activeAgents.length >= 1) {
      sessions.push({
        id: '1',
        user: 'Amit Shah',
        agent: activeAgents[0].name,
        status: 'Active',
        duration: '15:30',
        type: 'Chat',
        issue: 'Booking Assistance',
        priority: 'medium',
        messages: [
          { sender: 'user', text: 'I booked a ticket but it shows waiting list. Can you help?', time: '15:10' },
          { sender: 'agent', text: 'I understand your concern. Let me check the status of your booking.', time: '15:12' },
          { sender: 'agent', text: 'Could you please share your PNR number?', time: '15:12' },
          { sender: 'user', text: '4528167359', time: '15:15' },
          { sender: 'agent', text: 'Thank you. I can see your booking is currently WL 15. The chances of confirmation look good based on historical data.', time: '15:18' }
        ]
      });
    }
    
    if (activeAgents.length >= 2) {
      sessions.push({
        id: '2',
        user: 'Meera Reddy',
        agent: activeAgents[1].name,
        status: 'Waiting',
        duration: '00:45',
        type: 'Voice',
        issue: 'Refund Status',
        priority: 'high',
        messages: [
          { sender: 'user', text: 'I cancelled my ticket 10 days ago but still no refund', time: '00:30' },
          { sender: 'agent', text: 'I apologize for the delay. Let me look into this right away.', time: '00:35' }
        ]
      });
    }
    
    // Add Rajesh Singh and Arun Kumar sessions with available agents
    if (activeAgents.length >= 3) {
      sessions.push({
        id: '3',
        user: 'Rajesh Singh',
        agent: activeAgents[2].name,
        status: 'Waiting',
        duration: '30:45',
        type: 'Chat',
        issue: 'PNR Confirmation Query',
        priority: 'medium',
        messages: [
          { sender: 'user', text: 'Can you tell me the current status of my PNR?', time: '30:30' },
          { sender: 'agent', text: 'Please share your PNR number and I\'ll check it for you.', time: '30:40' }
        ]
      });
    }
    
    if (activeAgents.length >= 4) {
      sessions.push({
        id: '4',
        user: 'Arun Kumar',
        agent: activeAgents[3].name,
        status: 'Waiting',
        duration: '21:30',
        type: 'Video',
        issue: 'Refund Delay',
        priority: 'high',
        messages: [
          { sender: 'user', text: 'My refund has been pending for 15 days now', time: '21:15' },
          { sender: 'agent', text: 'I\'ll check the status and expedite it for you', time: '21:25' }
        ]
      });
    }
    
    // Add additional sessions if more agents are available
    for (let i = 4; i < Math.min(8, activeAgents.length); i++) {
      const randomUserIndex = Math.floor(Math.random() * users.length);
      const randomIssueIndex = Math.floor(Math.random() * issues.length);
      const sessionType = ['Chat', 'Voice', 'Video'][Math.floor(Math.random() * 3)] as 'Chat' | 'Voice' | 'Video';
      const priority = ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high';
      
      // Random duration between 1-45 minutes
      const mins = Math.floor(Math.random() * 45) + 1;
      const secs = Math.floor(Math.random() * 60);
      const duration = `${mins}:${secs.toString().padStart(2, '0')}`;
      
      sessions.push({
        id: (i + 1).toString(),
        user: users[randomUserIndex],
        agent: activeAgents[i].name,
        status: Math.random() > 0.3 ? 'Active' : 'Waiting',
        duration: duration,
        type: sessionType,
        issue: issues[randomIssueIndex],
        priority: priority
      });
    }
    
    setActiveSessions(sessions);
  };

  // Update timer for active sessions
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSessions(prev => 
        prev.map(session => {
          if (session.status === 'Active' || session.status === 'Waiting') {
            const [minutes, seconds] = session.duration.split(':').map(Number);
            let newSeconds = seconds + 1;
            let newMinutes = minutes;
            
            if (newSeconds === 60) {
              newSeconds = 0;
              newMinutes++;
            }
            
            return {
              ...session,
              duration: `${newMinutes}:${newSeconds.toString().padStart(2, '0')}`
            };
          }
          return session;
        })
      );
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Update sessions when staff data is loaded to make it more realistic
  useEffect(() => {
    if (agents.length > 0 && activeSessions.length < 5) {
      // Create additional sessions with actual staff members
      const availableAgents = agents.filter(a => a.status === 'active');
      if (availableAgents.length > 0) {
        const users = [
          'Vikram Sharma', 'Sunita Patel', 'Arun Kumar', 
          'Deepa Mehta', 'Rajesh Singh', 'Kavita Gupta'
        ];
        
        const issues = [
          'PNR Confirmation Query', 'Refund Delay', 'Cleanliness Issue',
          'Food Quality Complaint', 'AC Not Working', 'Security Concern'
        ];
        
        // Add a few more realistic sessions
        const newSessions = [...activeSessions];
        
        for (let i = 0; i < Math.min(3, availableAgents.length); i++) {
          if (newSessions.length < 8) { // Cap at 8 total sessions
            const randomUserIndex = Math.floor(Math.random() * users.length);
            const randomIssueIndex = Math.floor(Math.random() * issues.length);
            const sessionType = ['Chat', 'Voice', 'Video'][Math.floor(Math.random() * 3)] as 'Chat' | 'Voice' | 'Video';
            const priority = ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high';
            
            const mins = Math.floor(Math.random() * 30) + 1;
            const secs = Math.floor(Math.random() * 60);
            const duration = `${mins}:${secs.toString().padStart(2, '0')}`;
            
            newSessions.push({
              id: (newSessions.length + 1).toString(),
              user: users[randomUserIndex],
              agent: availableAgents[i].name,
              status: Math.random() > 0.3 ? 'Active' : 'Waiting',
              duration: duration,
              type: sessionType,
              issue: issues[randomIssueIndex],
              priority: priority
            });
          }
        }
        
        setActiveSessions(newSessions);
      }
    }
  }, [agents]);

  // Calculate stats for dashboard cards
  const activeAgentsCount = agents.filter(a => a.status === 'active').length;
  const waitingSessionsCount = activeSessions.filter(s => s.status === 'Waiting').length;
  const avgResponseTime = formatAverageWaitTime();
  
  function formatAverageWaitTime() {
    const waitingSessions = activeSessions.filter(s => s.status === 'Waiting');
    if (waitingSessions.length === 0) return '0:00';
    
    const totalSeconds = waitingSessions.reduce((acc, session) => {
      const [mins, secs] = session.duration.split(':').map(Number);
      return acc + (mins * 60 + secs);
    }, 0);
    
    const avgSeconds = Math.floor(totalSeconds / waitingSessions.length);
    const minutes = Math.floor(avgSeconds / 60);
    const seconds = avgSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Get agent status display text
  const getAgentDisplayStatus = (status: string) => {
    switch(status) {
      case 'active': return 'Available';
      case 'inactive': return 'Busy';
      case 'on-leave': return 'Offline';
      default: return 'Unknown';
    }
  };

  // Get CSS classes for agent status
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

  // Get CSS classes for priority
  const getPriorityClass = (priority?: string) => {
    switch(priority) {
      case 'high':
        return isDark ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800';
      case 'medium':
        return isDark ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-800';
      case 'low':
        return isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800';
      default:
        return isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };

  // Handler for loading more agents
  const loadMoreAgents = () => {
    setDisplayAgentCount(prevCount => prevCount + 3);
  };

  // Simulate refreshing data
  const refreshData = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Filter sessions based on selected filters
  const filteredSessions = activeSessions.filter(session => {
    if (statusFilter !== 'all' && session.status !== statusFilter) return false;
    if (typeFilter !== 'all' && session.type !== typeFilter) return false;
    return true;
  });

  // Filter agents based on communication preferences
  const filteredAgents = agents.filter(agent => {
    // Filter by communication preference if set
    if (supportType === 'chat' && agent.communication_preferences && 
        !agent.communication_preferences.includes('Chat')) {
      return false;
    }
    if (supportType === 'voice' && agent.communication_preferences && 
        !agent.communication_preferences.includes('Voice')) {
      return false;
    }
    if (supportType === 'video' && agent.communication_preferences && 
        !agent.communication_preferences.includes('Video')) {
      return false;
    }
    
    // Only show active agents
    return agent.status === 'active';
  });

  // Start new session handler
  const handleStartSession = () => {
    if (!issue.trim()) {
      alert('Please describe the issue');
      return;
    }
    
    const newSession: ChatSession = {
      id: (activeSessions.length + 1).toString(),
      user: 'Current User',
      agent: selectedAgent 
        ? agents.find(a => a.id === selectedAgent)?.name || 'Auto-assigned Agent' 
        : 'Auto-assigned Agent',
      status: 'Waiting',
      duration: '0:00',
      type: supportType === 'chat' ? 'Chat' : supportType === 'voice' ? 'Voice' : 'Video',
      issue: issue,
      priority: 'medium',
      messages: [
        { sender: 'user', text: issue, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
      ]
    };
    
    setActiveSessions([...activeSessions, newSession]);
    setIssue('');
    setActiveSession(newSession.id);
    
    // Show success message
    alert('Session created successfully!');
  };

  // Update the contact function to handle WhatsApp
  const handleContactStaff = (agent: SupportAgent, type: string) => {
    if (type === 'Chat' && agent.email) {
      window.location.href = `mailto:${agent.email}?subject=Rail Madad Support Request`;
    } else if (type === 'Voice' && agent.phone) {
      // Clean the phone number - remove spaces, hyphens, etc.
      const cleanPhone = agent.phone.replace(/[^\d+]/g, '');
      window.location.href = `tel:${cleanPhone}`;
    } else if (type === 'Video' && agent.phone) {
      // Format phone for WhatsApp - remove spaces, hyphens, etc.
      const cleanPhone = agent.phone.replace(/[^\d+]/g, '');
      // Remove the + sign if present and use international format
      const whatsappNumber = cleanPhone.startsWith('+') ? cleanPhone.substring(1) : cleanPhone;
      window.open(`https://wa.me/${whatsappNumber}?text=Hello%2C%20I'm%20contacting%20you%20from%20Rail%20Madad%20for%20support.%20Can%20we%20start%20a%20video%20call%3F`, '_blank');
    }
  };

  // Render availability timeline for an agent
  const renderAvailabilityTimeline = (availability?: number[]) => {
    if (!availability) return null;
    
    // Convert availability data to visual representation
    return (
      <div className="flex mt-2 h-2">
        {availability.map((level, i) => (
          <div 
            key={i}
            className={`flex-1 ${
              level === 0 
                ? isDark ? 'bg-gray-700' : 'bg-gray-200'
                : level < 3
                  ? isDark ? 'bg-blue-800' : 'bg-blue-200'
                  : level < 5
                    ? isDark ? 'bg-blue-600' : 'bg-blue-400'
                    : isDark ? 'bg-blue-400' : 'bg-blue-600'
            }`}
            title={`${i}:00 - Availability: ${level}/7`}
          />
        ))}
      </div>
    );
  };

  // Render star rating
  const renderStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i}
            className={`h-3 w-3 ${
              i < fullStars
                ? 'text-yellow-400 fill-yellow-400'
                : i === fullStars && hasHalfStar
                  ? 'text-yellow-400 fill-yellow-400 half-star'
                  : isDark ? 'text-gray-600' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-xs">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Card click handlers
  const handleCardClick = (cardType: string) => {
    switch(cardType) {
      case 'sessions':
        setStatusFilter('Active');
        setTypeFilter('all');
        break;
      case 'agents':
        // Open agent management modal or redirect
        alert('View all staff members and their status');
        break;
      case 'wait-time':
        setStatusFilter('Waiting');
        setTypeFilter('all');
        break;
      case 'resolution':
        // Show resolution analytics
        alert('Detailed resolution analytics report');
        break;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-lg p-6 transition-all duration-300`}>
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${isDark ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
              <Headphones className={`h-6 w-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>
            <h1 className="text-2xl font-semibold">Real-Time Support Center</h1>
          </div>
          
          <button
            onClick={refreshData}
            className={`p-2 rounded-lg flex items-center gap-2 ${
              isDark 
                ? 'hover:bg-gray-700 bg-gray-750' 
                : 'hover:bg-gray-100 bg-gray-50'
            } transition-colors`}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm">Refresh</span>
          </button>
        </div>

        {/* Dashboard cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div 
            onClick={() => handleCardClick('sessions')}
            className={`${isDark ? 'bg-blue-900/40 hover:bg-blue-900/60' : 'bg-blue-50 hover:bg-blue-100'} p-6 rounded-lg transform transition-all hover:scale-105 cursor-pointer active:scale-95 shadow-sm hover:shadow`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium mb-1 opacity-80">Active Sessions</h3>
                <div className={`text-3xl font-bold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                  {activeSessions.filter(s => s.status === 'Active').length}
                </div>
                <div className="mt-1 text-xs opacity-70">
                  {waitingSessionsCount} waiting
                </div>
              </div>
              <div className={`p-3 rounded-full ${isDark ? 'bg-blue-800' : 'bg-blue-200'}`}>
                <MessageSquare className={`h-5 w-5 ${isDark ? 'text-blue-200' : 'text-blue-600'}`} />
              </div>
            </div>
            <div className="mt-4 text-xs">
              <span className="underline">Click to view active sessions</span>
            </div>
          </div>

          <div 
            onClick={() => handleCardClick('agents')}
            className={`${isDark ? 'bg-green-900/40 hover:bg-green-900/60' : 'bg-green-50 hover:bg-green-100'} p-6 rounded-lg transform transition-all hover:scale-105 cursor-pointer active:scale-95 shadow-sm hover:shadow`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium mb-1 opacity-80">Available Agents</h3>
                <div className={`text-3xl font-bold ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                  {activeAgentsCount}
                </div>
                <div className="mt-1 text-xs opacity-70">
                  {agents.length} total staff
                </div>
              </div>
              <div className={`p-3 rounded-full ${isDark ? 'bg-green-800' : 'bg-green-200'}`}>
                <Users className={`h-5 w-5 ${isDark ? 'text-green-200' : 'text-green-600'}`} />
              </div>
            </div>
            <div className="mt-4 text-xs">
              <span className="underline">Click to manage staff</span>
            </div>
          </div>

          <div 
            onClick={() => handleCardClick('wait-time')}
            className={`${isDark ? 'bg-yellow-900/40 hover:bg-yellow-900/60' : 'bg-yellow-50 hover:bg-yellow-100'} p-6 rounded-lg transform transition-all hover:scale-105 cursor-pointer active:scale-95 shadow-sm hover:shadow`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium mb-1 opacity-80">Avg. Wait Time</h3>
                <div className={`text-3xl font-bold ${isDark ? 'text-yellow-300' : 'text-yellow-600'}`}>
                  {avgResponseTime}
                </div>
                <div className="mt-1 text-xs opacity-70">
                  Minutes:Seconds
                </div>
              </div>
              <div className={`p-3 rounded-full ${isDark ? 'bg-yellow-800' : 'bg-yellow-200'}`}>
                <Clock className={`h-5 w-5 ${isDark ? 'text-yellow-200' : 'text-yellow-600'}`} />
              </div>
            </div>
            <div className="mt-4 text-xs">
              <span className="underline">View waiting sessions</span>
            </div>
          </div>

          <div 
            onClick={() => handleCardClick('resolution')}
            className={`${isDark ? 'bg-purple-900/40 hover:bg-purple-900/60' : 'bg-purple-50 hover:bg-purple-100'} p-6 rounded-lg transform transition-all hover:scale-105 cursor-pointer active:scale-95 shadow-sm hover:shadow`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium mb-1 opacity-80">Resolution Rate</h3>
                <div className={`text-3xl font-bold ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
                  92%
                </div>
                <div className="mt-1 text-xs opacity-70">
                  Last 24 hours
                </div>
              </div>
              <div className={`p-3 rounded-full ${isDark ? 'bg-purple-800' : 'bg-purple-200'}`}>
                <CheckCircle className={`h-5 w-5 ${isDark ? 'text-purple-200' : 'text-purple-600'}`} />
              </div>
            </div>
            <div className="mt-4 text-xs">
              <span className="underline">View analytics</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 mb-6`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Active Support Sessions</h2>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className={`rounded-l-md border text-sm ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-700'
                      } px-3 py-1`}
                    >
                      <option value="all">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Waiting">Waiting</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className={`rounded-r-md border-y border-r text-sm ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-700'
                      } px-3 py-1`}
                    >
                      <option value="all">All Types</option>
                      <option value="Chat">Chat</option>
                      <option value="Voice">Voice</option>
                      <option value="Video">Video</option>
                    </select>
                  </div>
                  <button 
                    className={`rounded-md p-1 ${
                      isDark 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <Filter className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {filteredSessions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg`}>
                      <tr>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase rounded-tl-lg`}>User</th>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase`}>Agent</th>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase`}>Status</th>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase`}>Duration</th>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase`}>Type</th>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase rounded-tr-lg`}>Priority</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      {filteredSessions.map((session) => (
                        <tr 
                          key={session.id} 
                          className={`cursor-pointer transition-colors ${
                            activeSession === session.id
                              ? isDark ? 'bg-indigo-900/30' : 'bg-indigo-50'
                              : isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setActiveSession(session.id === activeSession ? null : session.id)}
                        >
                          <td className="px-6 py-4 flex items-center gap-2">
                            <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-medium">
                              {session.user.substring(0, 1)}
                            </div>
                            <span>{session.user}</span>
                          </td>
                          <td className="px-6 py-4">{session.agent}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                session.status === 'Active'
                                  ? isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                                  : session.status === 'Waiting'
                                    ? isDark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                                    : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {session.status === 'Active' && <span className="mr-1 inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>}
                              {session.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {session.status === 'Active' ? (
                              <span className="animate-pulse">{session.duration}</span>
                            ) : (
                              session.duration
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div 
                              className="flex items-center gap-2 cursor-pointer hover:underline"
                              onClick={() => {
                                const agent = agents.find(a => a.name === session.agent);
                                if (agent) {
                                  if (session.type === 'Chat') {
                                    handleContactStaff(agent, 'Chat');
                                  } else if (session.type === 'Voice') {
                                    handleContactStaff(agent, 'Voice');
                                  } else if (session.type === 'Video') {
                                    handleContactStaff(agent, 'Video');
                                  }
                                }
                              }}
                            >
                              {session.type === 'Chat' && <MessageSquare className={`h-4 w-4 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />}
                              {session.type === 'Voice' && <Phone className={`h-4 w-4 ${isDark ? 'text-green-400' : 'text-green-500'}`} />}
                              {session.type === 'Video' && <Video className={`h-4 w-4 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />}
                              <span>{session.type}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityClass(session.priority)}`}
                            >
                              {session.priority || 'Medium'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={`flex flex-col items-center justify-center p-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <MessageSquare className="h-10 w-10 mb-2 opacity-50" />
                  <p>No sessions match the selected filters</p>
                  <button 
                    onClick={() => {
                      setStatusFilter('all');
                      setTypeFilter('all');
                    }}
                    className="mt-4 text-indigo-500 hover:text-indigo-600 text-sm"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
            
            {activeSession && (
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 animate-fadeIn`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Session Details</h3>
                  <button 
                    onClick={() => setActiveSession(null)}
                    className={`p-1 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    ×
                  </button>
                </div>
                
                {activeSessions.find(s => s.id === activeSession)?.messages ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">
                          {activeSessions.find(s => s.id === activeSession)?.issue}
                        </h4>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {activeSessions.find(s => s.id === activeSession)?.user} with {activeSessions.find(s => s.id === activeSession)?.agent}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className={`p-2 rounded-lg ${isDark ? 'bg-green-900 hover:bg-green-800' : 'bg-green-100 hover:bg-green-200'}`}>
                          <Phone className="h-4 w-4" />
                        </button>
                        <button className={`p-2 rounded-lg ${isDark ? 'bg-purple-900 hover:bg-purple-800' : 'bg-purple-100 hover:bg-purple-200'}`}>
                          <Video className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className={`h-60 overflow-y-auto p-4 rounded-lg ${isDark ? 'bg-gray-750' : 'bg-gray-50'}`}>
                      {activeSessions.find(s => s.id === activeSession)?.messages?.map((msg, idx) => (
                        <div key={idx} className={`mb-4 flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                          <div 
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                              msg.sender === 'user'
                                ? isDark ? 'bg-gray-700' : 'bg-gray-200'
                                : isDark ? 'bg-indigo-900' : 'bg-indigo-100'
                            }`}
                          >
                            <div className="text-sm">{msg.text}</div>
                            <div className={`text-right text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{msg.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Type a message..."
                        className={`flex-1 px-4 py-2 rounded-lg border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      />
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        Send
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No message history available for this session</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 mb-6`}>
              <h2 className="text-xl font-semibold mb-6">Start New Session</h2>
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                    Support Type
                  </label>
                  <div className="flex gap-4">
                    {['chat', 'voice', 'video'].map((type) => (
                      <button
                        key={type}
                        className={`flex flex-col items-center p-4 rounded-lg border flex-1 transition-all ${
                          supportType === type
                            ? isDark 
                              ? 'border-indigo-500 bg-indigo-900/50 shadow-inner shadow-indigo-800' 
                              : 'border-indigo-500 bg-indigo-50 shadow-sm'
                            : isDark 
                              ? 'border-gray-700 hover:border-indigo-500 hover:bg-gray-700/50' 
                              : 'border-gray-200 hover:border-indigo-500 hover:bg-gray-50'
                        }`}
                        onClick={() => setSupportType(type as 'chat' | 'voice' | 'video')}
                      >
                        {type === 'chat' && <MessageSquare className={`h-6 w-6 mb-2 ${supportType === type ? 'text-indigo-500' : ''}`} />}
                        {type === 'voice' && <Phone className={`h-6 w-6 mb-2 ${supportType === type ? 'text-indigo-500' : ''}`} />}
                        {type === 'video' && <Video className={`h-6 w-6 mb-2 ${supportType === type ? 'text-indigo-500' : ''}`} />}
                        <span className="capitalize">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                    Describe Your Issue
                  </label>
                  <textarea
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="Please describe your issue..."
                  ></textarea>
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
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                      {filteredAgents.length > 0 ? (
                        <>
                          {filteredAgents.slice(0, displayAgentCount).map((agent) => (
                            <div
                              key={agent.id}
                              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                selectedAgent === agent.id
                                  ? isDark ? 'border-indigo-500 bg-indigo-900/50' : 'border-indigo-500 bg-indigo-50'
                                  : isDark ? 'border-gray-700 hover:border-indigo-500' : 'border-gray-200 hover:border-indigo-500'
                              }`}
                              onClick={() => setSelectedAgent(agent.id === selectedAgent ? null : agent.id)}
                              onMouseEnter={() => setIsAgentHovered(agent.id)}
                              onMouseLeave={() => setIsAgentHovered(null)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="shrink-0">
                                  <img 
                                    src={agent.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                                    alt={agent.name} 
                                    className="h-10 w-10 rounded-full"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center">
                                    <h3 className="font-medium truncate">{agent.name}</h3>
                                    <span
                                      className={`ml-2 shrink-0 px-2 py-1 text-xs rounded-full ${getAgentStatusClass(agent.status)}`}
                                    >
                                      {agent.status === 'active' && <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>}
                                      {getAgentDisplayStatus(agent.status)}
                                    </span>
                                  </div>
                                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                                    {agent.expertise.length > 0 
                                      ? agent.expertise.join(', ') 
                                      : 'General Support'}
                                  </div>
                                  
                                  <div className={`mt-2 flex items-center justify-between text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    <div className="flex items-center gap-1">
                                      {renderStarRating(typeof agent.rating === 'string' ? parseFloat(agent.rating) : agent.rating)}
                                    </div>
                                    <span>Chats: {agent.activeChats || 0}</span>
                                  </div>
                                  
                                  {(isAgentHovered === agent.id || selectedAgent === agent.id) && agent.availability && (
                                    <div className="mt-3 mb-1">
                                      <div className="text-xs mb-1 flex justify-between items-center">
                                        <span>Availability (24h)</span>
                                        <div className="flex items-center text-xs">
                                          <span className={`inline-block h-2 w-2 ${isDark ? 'bg-blue-400' : 'bg-blue-600'} rounded-full mr-1`}></span>
                                          <span>High</span>
                                          <span className={`inline-block h-2 w-2 ${isDark ? 'bg-blue-800' : 'bg-blue-300'} rounded-full ml-2 mr-1`}></span>
                                          <span>Low</span>
                                        </div>
                                      </div>
                                      {renderAvailabilityTimeline(agent.availability)}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Add communication preferences */}
                              <div className="mt-2 flex gap-2">
                                {agent.communication_preferences?.map(pref => (
                                  <div 
                                    key={pref}
                                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                                      pref === 'Chat' 
                                        ? isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                                        : pref === 'Voice'
                                          ? isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'
                                          : isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'
                                    } cursor-pointer`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleContactStaff(agent, pref);
                                    }}
                                  >
                                    {pref === 'Chat' && <MessageSquare className="h-3 w-3" />}
                                    {pref === 'Voice' && <Phone className="h-3 w-3" />}
                                    {pref === 'Video' && <Video className="h-3 w-3" />}
                                    {pref}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                          
                          {filteredAgents.length > displayAgentCount && (
                            <button
                              onClick={loadMoreAgents}
                              className={`w-full p-3 text-center ${
                                isDark 
                                  ? 'bg-gray-750 hover:bg-gray-700 text-white border border-gray-700' 
                                  : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200'
                              } rounded-lg flex items-center justify-center gap-2 transition-colors`}
                            >
                              <ChevronDownIcon className="h-4 w-4" />
                              Load More Agents
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-4"></div>
                          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            No agents available for {supportType.charAt(0).toUpperCase() + supportType.slice(1)} support.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleStartSession}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Start {supportType.charAt(0).toUpperCase() + supportType.slice(1)} Session
                </button>
              </div>
            </div>
            
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Support Statistics</h3>
                <div className="flex gap-2">
                  <button className={`px-2.5 py-1 text-xs rounded-md ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>Day</button>
                  <button className={`px-2.5 py-1 text-xs rounded-md ${isDark ? 'bg-indigo-900' : 'bg-indigo-100'}`}>Week</button>
                  <button className={`px-2.5 py-1 text-xs rounded-md ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>Month</button>
                </div>
              </div>
              
              <div className="h-40 mt-4" ref={chartRef}>
                <div className="flex h-full items-end gap-1">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const height = 30 + Math.random() * 60;
                    return (
                      <div 
                        key={i} 
                        className="flex-1 group relative cursor-pointer transition-all hover:opacity-80"
                        style={{ height: `${height}%` }}
                      >
                        <div 
                          className={`w-full h-full rounded-t-sm ${
                            isDark 
                              ? 'bg-gradient-to-t from-indigo-900 to-indigo-700' 
                              : 'bg-gradient-to-t from-indigo-500 to-indigo-400'
                          }`}
                        ></div>
                          <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs ${
                            isDark ? 'bg-gray-700' : 'bg-white border border-gray-200'
                          } opacity-0 group-hover:opacity-100 transition-opacity shadow-lg`}>
                            {Math.floor(height)}
                          </div>
                          <div className={`text-xs mt-1 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-750' : 'bg-gray-50'}`}>
                    <div className="text-sm font-medium">Resolution Time</div>
                    <div className="text-xl font-bold mt-1">12:35</div>
                    <div className="text-xs mt-1 text-green-500 flex items-center">
                      <span>▲</span> 8% from last week
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-750' : 'bg-gray-50'}`}>
                    <div className="text-sm font-medium">Satisfaction Rate</div>
                    <div className="text-xl font-bold mt-1">95%</div>
                    <div className="text-xs mt-1 text-green-500 flex items-center">
                      <span>▲</span> 2% from last week
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
        .bg-gray-750 {
          background-color: #232836;
        }
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        /* Half star style */
        .half-star {
          position: relative;
          overflow: hidden;
          display: inline-block;
          width: 0.75em;
        }
      `}</style>
    </div>
  );
};

export default RealTimeSupport;
