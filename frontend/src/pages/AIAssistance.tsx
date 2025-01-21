import { Bot, MessageCircle, Loader } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const AIAssistance = () => {
  const { theme } = useTheme();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I assist you with your railway-related concerns today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I understand your concern. Let me help you with that. What specific details can you provide about the issue?' 
      }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-lg p-6 mb-6`}>
        <div className="flex items-center gap-3 mb-6">
          <Bot className={`h-8 w-8 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h1 className="text-2xl font-semibold">AI Assistant</h1>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg p-4 h-[500px] overflow-y-auto mb-4`}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <Loader className="h-5 w-5 animate-spin" />
              <span>AI is thinking...</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300'
            }`}
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <MessageCircle className="h-5 w-5" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistance;