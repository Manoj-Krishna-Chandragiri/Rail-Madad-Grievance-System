import { Bot, MessageCircle, Loader, Mic, MicOff } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import AudioTranscription from '../components/AudioTranscription';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const SYSTEM_PROMPT = `You are a helpful AI assistant for Rail Madad, an Indian Railways complaint management system. Your role is to:
1. Help passengers with their railway-related queries and complaints
2. Provide information about using the Rail Madad application
3. Guide users on how to register complaints
4. Explain the complaint tracking process
5. Provide relevant contact information when needed
6. Be polite, professional, and concise in your responses

Keep responses focused on Indian Railways and Rail Madad services. If asked about anything unrelated, politely redirect to railway-related topics.`;

const AIAssistance = () => {
  const { theme } = useTheme();
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hello! I\'m your Rail Madad assistant. How can I help you with your railway-related concerns today?' 
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { isRecording, toggleRecording } = AudioTranscription({
    onTranscriptionComplete: (text) => {
      setMessage(text);
      // Optional: Auto-submit after transcription
      // if (text && inputRef.current) {
      //   inputRef.current.form?.requestSubmit();
      // }
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAqZM-UDBhmEA5xSTGE6Vufn3I1P0HvpkI`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              role: "user",
              parts: [{
                text: `${SYSTEM_PROMPT}\n\nUser: ${message}`
              }]
            }]
          })
        }
      );

      const data = await response.json();
      console.log('Gemini API Response:', data); // For debugging

      if (response.ok && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: aiResponse 
        }]);
      } else {
        console.error('API Error Response:', data);
        let errorMessage = 'An error occurred while processing your request.';
        if (data.error) {
          errorMessage = `Error: ${data.error.message || data.error.status}`;
        }
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: errorMessage
        }]);
      }
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Network error occurred. Please check your connection and try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
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
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            ref={inputRef}
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
            type="button"
            onClick={toggleRecording}
            className={`p-2 rounded-lg ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gray-600 hover:bg-gray-700'
            } text-white`}
            title={isRecording ? "Stop Recording" : "Start Recording"}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
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