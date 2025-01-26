import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { getAuth, onAuthStateChanged, updateProfile, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { uploadToCloudinary } from '../utils/cloudinary';

const MALE_DEFAULT_AVATAR = 'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-profile-picture-male-icon.png';
const FEMALE_DEFAULT_AVATAR = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHEJ-8GyKlZr5ZmEfRMmt5nR4tH_aP-crbgg&s';

const BACKUP_AVATAR = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'; // Backup URL

interface UserData {
  name: string;
  email: string;
  phoneNumber?: string;
  gender?: 'male' | 'female';
  address?: string;
  profileImage?: string;
}

const Profile = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<UserData | null>(null);
  const [updating, setUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = getAuth();
  const db = getFirestore();

  const handleImageUpload = async (file: File) => {
    if (!auth.currentUser) return null;

    try {
      const compressedFile = await compressImage(file);
      const cloudinaryUrl = await uploadToCloudinary(compressedFile as File);
      return cloudinaryUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const fetchUserData = async (user: any) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      
      // Get the latest profile image URL from Firestore
      const profileImage = userData?.profileImage || 
        (userData?.gender === 'female' ? FEMALE_DEFAULT_AVATAR : MALE_DEFAULT_AVATAR);

      setUserData({
        name: userData?.name || user.displayName || 'User',
        email: user.email || '',
        phoneNumber: userData?.phoneNumber || '',
        gender: userData?.gender,
        address: userData?.address || '',
        profileImage: profileImage // Use the stored image URL
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData({
        name: user.displayName || 'User',
        email: user.email || '',
        profileImage: MALE_DEFAULT_AVATAR
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchUserData(user);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(userData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(null);
  };

  const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Reduce size more aggressively
          const MAX_SIZE = 400; // Reduced from 800
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => resolve(blob!),
            'image/jpeg',
            0.6 // Reduced quality for smaller file size
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editedData) {
      const reader = new FileReader();
      reader.onload = () => {
        setEditedData({ ...editedData, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!editedData || !auth.currentUser) return;
    setUpdating(true);
    let imageUrl = editedData.profileImage;

    try {
      // Only upload new image if it's changed and is a data URL or blob
      if (editedData.profileImage?.startsWith('data:') || editedData.profileImage?.startsWith('blob:')) {
        try {
          const file = await fetch(editedData.profileImage).then(r => r.blob());
          const uploadedUrl = await handleImageUpload(file as File);
          if (uploadedUrl) {
            imageUrl = uploadedUrl;
          }
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          alert('Failed to upload image. Please try again.');
          setUpdating(false);
          return;
        }
      }

      // Update Firestore and auth profile
      const updates: Partial<UserData> = {
        name: editedData.name,
        phoneNumber: editedData.phoneNumber,
        address: editedData.address,
        gender: editedData.gender,
        profileImage: imageUrl
      };

      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, updates);

      await updateProfile(auth.currentUser, {
        displayName: editedData.name,
        photoURL: imageUrl
      });

      await fetchUserData(auth.currentUser);
      setIsEditing(false);
      setEditedData(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.target as HTMLImageElement;
    if (!imageError) {
      setImageError(true);
      img.src = BACKUP_AVATAR;
    }
  };

  const handleDeleteAccount = async () => {
    if (!auth.currentUser) return;

    try {
      // Re-authenticate user before deletion
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email!,
        password
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Delete user data from Firestore
      await deleteDoc(doc(db, "users", auth.currentUser.uid));

      // Delete user account
      await deleteUser(auth.currentUser);

      // Clear local storage and redirect
      localStorage.removeItem('isAuthenticated');
      navigate('/login');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      setError(error.message || 'Failed to delete account');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center p-6">
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <h1 className="text-2xl font-semibold mb-6">My Profile</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center">
            <img
              src={isEditing ? editedData?.profileImage : userData?.profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mb-4"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = userData.gender === 'female' ? FEMALE_DEFAULT_AVATAR : MALE_DEFAULT_AVATAR;
              }}
            />
            {isEditing && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  Change Photo
                </button>
              </>
            )}
          </div>

          <div className="flex-1 space-y-4">
            {isEditing ? (
              <>
                <div>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editedData?.name}
                    onChange={(e) => setEditedData(prev => ({ ...prev!, name: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 
                      ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editedData?.phoneNumber}
                    onChange={(e) => setEditedData(prev => ({ ...prev!, phoneNumber: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 
                      ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Address
                  </label>
                  <textarea
                    value={editedData?.address}
                    onChange={(e) => setEditedData(prev => ({ ...prev!, address: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 
                      ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    rows={3}
                  />
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleSave}
                    disabled={updating}
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={updating}
                    className={`flex-1 border py-2 rounded-lg 
                      ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Full Name
                  </label>
                  <p className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    {userData?.name}
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Email
                  </label>
                  <p className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    {userData?.email}
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Phone Number
                  </label>
                  <p className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    {userData?.phoneNumber || 'Not provided'}
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Gender
                  </label>
                  <p className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    {userData?.gender ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1) : 'Not provided'}
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Address
                  </label>
                  <p className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    {userData?.address || 'Not provided'}
                  </p>
                </div>
                
                {/* Move edit button to bottom */}
                <div className="pt-6">
                  <button
                    onClick={handleEdit}
                    className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Edit Profile
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Danger Zone
          </h2>
          <div className={`p-4 border border-red-500 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-red-500 font-semibold mb-2">Delete Account</h3>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Once you delete your account, there is no going back. Please be certain.
            </p>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete Account
              </button>
            ) : (
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Enter your password to confirm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'border-gray-300'
                  }`}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex gap-4">
                  <button
                    onClick={handleDeleteAccount}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setPassword('');
                      setError('');
                    }}
                    className={`px-4 py-2 rounded border ${
                      theme === 'dark'
                        ? 'border-gray-600 hover:bg-gray-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
