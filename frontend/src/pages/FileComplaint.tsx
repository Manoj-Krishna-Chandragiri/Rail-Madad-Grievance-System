import { FileUp, Camera, Paperclip } from 'lucide-react';
import { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const FileComplaint = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    location: '',
    trainNumber: '',
    pnrNumber: '',
    severity: 'Medium'
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Complaint submitted:', { ...formData, photos, attachments });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <div className="flex items-center gap-3 mb-6">
          <FileUp className={`h-8 w-8 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h1 className="text-2xl font-semibold">File a New Complaint</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
              Complaint Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 
                ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              required
            >
              <option value="">Select Type</option>
              <option value="technical">Technical</option>
              <option value="cleanliness">Cleanliness</option>
              <option value="food">Food & Catering</option>
              <option value="staff">Staff Behavior</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
              Severity Level
            </label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 
                ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
              Train Number
            </label>
            <input
              type="text"
              name="trainNumber"
              value={formData.trainNumber}
              onChange={handleChange}
              placeholder="Enter train number"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 
                ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
              PNR Number
            </label>
            <input
              type="text"
              name="pnrNumber"
              value={formData.pnrNumber}
              onChange={handleChange}
              placeholder="Enter PNR number"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 
                ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
              Location/Coach Details
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location or coach details"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 
                ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
              Complaint Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your complaint in detail"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 min-h-[100px]
                ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
              required
            />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className={`font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Uploaded Photos</h3>
              <div className="flex flex-wrap gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Photo ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotos(prev => prev.filter((_, i) => i !== index))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className={`font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>Uploaded Files</h3>
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className={`flex items-center justify-between p-2 rounded-lg
                    ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <input
              type="file"
              ref={photoInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              className="hidden"
            />
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg
                ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              <Camera className="h-5 w-5" />
              Add Photo
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg
                ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              <Paperclip className="h-5 w-5" />
              Attach File
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Submit Complaint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileComplaint;