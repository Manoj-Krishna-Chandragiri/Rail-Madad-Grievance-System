import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<UserData | null>(null);
  const [updating, setUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState(false);
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data();
          setUserData({
            name: userData?.name || user.displayName || 'User',
            email: user.email || '',
            phoneNumber: userData?.phoneNumber || '',
            gender: userData?.gender,
            address: userData?.address || '',
            profileImage: user.photoURL || 
              (userData?.gender === 'female' ? FEMALE_DEFAULT_AVATAR : MALE_DEFAULT_AVATAR)
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData({
            name: user.displayName || 'User',
            email: user.email || '',
            profileImage: MALE_DEFAULT_AVATAR
          });
        }
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

  const handleImageUpload = async (file: File) => {
    if (!auth.currentUser) return;

    try {
      // Compress image before uploading
      const compressedFile = await compressImage(file);
      
      // Create a unique filename
      const fileName = `profile_${auth.currentUser.uid}_${Date.now()}.jpg`;
      const storageRef = ref(storage, `profile_images/${fileName}`);
      
      // Show loading state
      setUpdating(true);

      // Create temporary URL for immediate preview
      const tempURL = URL.createObjectURL(file);
      setEditedData(prev => ({ ...prev!, profileImage: tempURL }));

      // Upload the compressed image
      try {
        const snapshot = await uploadBytes(storageRef, compressedFile);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
      } catch (error) {
        console.error('Upload failed:', error);
        // Fallback to default avatar if upload fails
        return userData?.gender === 'female' ? FEMALE_DEFAULT_AVATAR : MALE_DEFAULT_AVATAR;
      }
    } catch (error) {
      console.error('Image processing failed:', error);
      return null;
    }
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
    try {
      const updates: Partial<UserData> = {
        name: editedData.name,
        phoneNumber: editedData.phoneNumber,
        address: editedData.address,
        gender: editedData.gender
      };

      // Only upload new image if it's changed
      if (editedData.profileImage?.startsWith('data:') || editedData.profileImage?.startsWith('blob:')) {
        const file = await fetch(editedData.profileImage).then(r => r.blob());
        const imageUrl = await handleImageUpload(file as File);
        if (imageUrl) {
          updates.profileImage = imageUrl;
        }
      }

      // Update Firestore first
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, updates);

      // Then update auth profile
      await updateProfile(auth.currentUser, {
        displayName: editedData.name,
        photoURL: updates.profileImage || editedData.profileImage
      });

      // Update local state
      setUserData({ ...editedData, profileImage: updates.profileImage || editedData.profileImage });
      setIsEditing(false);
      setEditedData(null);
    } catch (error) {
      console.error('Error updating profile:', error);
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
      </div>
    </div>
  );
};

export default Profile;
