import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Star } from 'lucide-react';

const FeedbackForm = () => {
  const { theme } = useTheme();
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    category: '',
    rating: 0,
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFeedback(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStarClick = (rating: number) => {
    setFeedback(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Feedback Submitted:', feedback);
  };

  const inputClass = theme === 'dark' 
    ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500' 
    : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500';

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <h1 className="text-3xl font-bold text-center mb-8">Feedback Form</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={feedback.name}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${inputClass}`}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={feedback.email}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${inputClass}`}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block mb-2 text-sm font-medium">Feedback Category</label>
            <select
              id="category"
              name="category"
              value={feedback.category}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border ${inputClass}`}
              required
            >
              <option value="">Select Category</option>
              <option value="complaint">Complaint Handling</option>
              <option value="support">Support Quality</option>
              <option value="ai">AI Assistance</option>
              <option value="general">General Feedback</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Rate Your Experience</label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className="focus:outline-none"
                >
                  <Star 
                    className={`h-8 w-8 ${
                      star <= feedback.rating 
                        ? 'text-yellow-500 fill-current' 
                        : (theme === 'dark' ? 'text-gray-600' : 'text-gray-300')
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm">
                {feedback.rating ? `${feedback.rating}/5` : ''}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block mb-2 text-sm font-medium">Your Feedback</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={feedback.message}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border ${inputClass}`}
              required
            />
          </div>

          <div className="text-center">
            <button 
              type="submit" 
              className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                theme === 'dark' 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              }`}
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;