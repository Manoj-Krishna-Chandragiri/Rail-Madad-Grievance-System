import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '../components/icons/GoogleIcon';
import { useTheme } from '../context/ThemeContext';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, sendEmailVerification, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import { handleMFAChallenge } from '../utils/mfa';

const MALE_DEFAULT_AVATAR = 'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-profile-picture-male-icon.png';
const FEMALE_DEFAULT_AVATAR = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHEJ-8GyKlZr5ZmEfRMmt5nR4tH_aP-crbgg&s';

interface SignUpData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  gender: 'male' | 'female' | '';
  address: string;
  profileImage: string;
}

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  required?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange, label, required = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();

  return (
    <div>
      <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 pr-10 
            ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          required={required}
        />
        <button
          type="button"
          className={`absolute right-2 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setShowPassword(!showPassword)}
        >
          <svg 
            viewBox="0 0 24 24" 
            width="20" 
            height="20"
          >
            {showPassword ? (
              <path 
                fill="currentColor"
                fillRule="evenodd" 
                d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
              />
            ) : (
              <path 
                fill="currentColor"
                fillRule="evenodd" 
                d="M7.119 14.563L5.982 16.53l-1.732-1 1.301-2.253A8.97 8.97 0 0 1 3 7h2a7 7 0 0 0 14 0h2a8.973 8.973 0 0 1-2.72 6.448l1.202 2.083-1.732 1-1.065-1.845A8.944 8.944 0 0 1 13 15.946V18h-2v-2.055a8.946 8.946 0 0 1-3.881-1.382z"
              />
            )}
          </svg>
        </button>
      </div>
    </div>
  );
};

const firebaseConfig = {
  apiKey: "AIzaSyAeP3pD8WZkil9h-Z06_WLtEJgmC6rRFko",
  authDomain: "railmadad-login.firebaseapp.com",
  projectId: "railmadad-login",
  storageBucket: "railmadad-login.appspot.com",
  messagingSenderId: "914935310403",
  appId: "1:914935310403:web:edc5a318f2d9c9e9df8cf6"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

const showMessage = (message: string, setError: React.Dispatch<React.SetStateAction<string>>, type: 'success' | 'error' | 'info' = 'error') => {
  setError(message);
  // Scroll to top when message is shown
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => {
    setError('');
  }, 5000);
  return type; // Return type to be used for styling
};

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [signUpData, setSignUpData] = useState<SignUpData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    gender: '',
    address: '',
    profileImage: ''
  });
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('error');
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Add useRef for the error message container
  const errorRef = useRef<HTMLDivElement>(null);

  // Add useEffect to scroll to error message when it changes
  useEffect(() => {
    if (error) {
      errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [error]);

  const [showMFAPrompt, setShowMFAPrompt] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [mfaResolver, setMFAResolver] = useState<any>(null);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    // Initialize recaptcha only once when component mounts
    if (!recaptchaVerifier.current) {
      recaptchaVerifier.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal',
        callback: () => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          // Reset the reCAPTCHA
          if (recaptchaVerifier.current) {
            recaptchaVerifier.current.clear();
            recaptchaVerifier.current = null;
          }
        }
      });
    }

    // Cleanup function
    return () => {
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
        recaptchaVerifier.current = null;
      }
    };
  }, []);

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Format phone number to E.164 format
      let formattedPhone = phoneNumber;
      if (!phoneNumber.startsWith('+')) {
        formattedPhone = '+91' + phoneNumber; // Add Indian country code if not present
      }

      if (!recaptchaVerifier.current) {
        recaptchaVerifier.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'normal',
          callback: () => {
            // reCAPTCHA solved
          }
        });
      }

      const appVerifier = recaptchaVerifier.current;
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setVerificationId(confirmationResult.verificationId);
      setMessageType(showMessage('Verification code sent to your phone.', setError, 'success'));
    } catch (error: any) {
      console.error("Error during phone sign-in", error);
      if (error.code === 'auth/invalid-phone-number') {
        setMessageType(showMessage('Invalid phone number format. Please use format: +91XXXXXXXXXX', setError, 'error'));
      } else if (error.code === 'auth/operation-not-allowed') {
        setMessageType(showMessage('Phone authentication is not enabled. Please contact support.', setError, 'error'));
      } else if (error.code === 'auth/billing-not-enabled') {
        setMessageType(showMessage('Phone authentication is currently unavailable. Please use email or Google sign-in.', setError, 'error'));
      } else {
        setMessageType(showMessage('Failed to send verification code. Please try again.', setError, 'error'));
      }

      // Reset reCAPTCHA on error
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
        recaptchaVerifier.current = null;
      }
    }
  };

  const handlePhoneVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      const userCredential = await signInWithCredential(auth, credential);
      setMessageType(showMessage('Phone number verified successfully!', setError, 'success'));
      navigate('/');
    } catch (error) {
      console.error("Error during phone verification", error);
      setMessageType(showMessage('Invalid verification code', setError, 'error'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Special handling for admin account
      if (email === 'adm.railmadad@gmail.com' && password === 'admin@2025') {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'admin');
        navigate('/dashboard');
        return;
      }

      // Regular user authentication
      if (!user.emailVerified) {
        setMessageType(showMessage('Please verify your email before signing in. Check your inbox.', setError, 'error'));
        return;
      }

      // Set up user session
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'passenger');
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setMessageType(showMessage('Login successful!', setError, 'success'));
        navigate('/');
      } else {
        setMessageType(showMessage('User data not found', setError, 'error'));
      }
    } catch (error: any) {
      if (error.code === 'auth/multi-factor-auth-required') {
        setMFAResolver(error);
        setShowMFAPrompt(true);
        setMessageType('info');
        setError('Please enter the verification code sent to your phone.');
      } else {
        if (error.code === 'auth/invalid-credential') {
          setMessageType(showMessage('Incorrect Email or Password', setError, 'error'));
        } else {
          setMessageType(showMessage('Login failed. Please try again.', setError, 'error'));
        }
      }
    }
  };

  const handleMFAVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleMFAChallenge(mfaResolver, verificationCode);
      // Successfully completed MFA
      setMessageType(showMessage('Login successful!', setError, 'success'));
      navigate('/');
    } catch (error) {
      setMessageType(showMessage('Invalid verification code', setError, 'error'));
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      localStorage.setItem('isAuthenticated', 'true');

      if (!userDoc.exists()) {
        // First time user - create basic profile and redirect to profile page
        const initialUserData = {
          email: user.email,
          name: user.displayName,
          profileImage: user.photoURL || MALE_DEFAULT_AVATAR,
          createdAt: new Date().toISOString()
        };
        
        await setDoc(doc(db, "users", user.uid), initialUserData);
        navigate('/profile?newUser=true'); // Redirect to profile for setup
      } else {
        // Existing user - redirect to home
        navigate('/');
      }
    } catch (error) {
      console.error("Error during Google Sign-In", error);
      showMessage('Google Sign-In failed', setError);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        setShowForgotPassword(false);
        setMessageType(showMessage('Password reset link sent to your email', setError, 'success'));
      })
      .catch(() => {
        setMessageType(showMessage('Failed to send password reset email', setError, 'error'));
      });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpData.password !== signUpData.confirmPassword) {
      setMessageType(showMessage('Passwords do not match', setError, 'error'));
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        signUpData.email, 
        signUpData.password
      );
      const user = userCredential.user;

      // Send email verification
      // Send email verification
      await sendEmailVerification(user);
      // Save user data to Firestore
      const userData = {
        email: signUpData.email,
        name: signUpData.name,
        phoneNumber: signUpData.phoneNumber,
        gender: signUpData.gender,
        address: signUpData.address,
        profileImage: signUpData.gender === 'male' ? MALE_DEFAULT_AVATAR : FEMALE_DEFAULT_AVATAR,
        emailVerified: false
      };

      await setDoc(doc(db, "users", user.uid), userData);
      setMessageType(showMessage('Verification email sent! Please check your inbox and verify your email before signing in.', setError, 'success'));
      setShowSignUp(false);
    } catch (error: any) {
      console.error('Error during signup:', error);
      if (error.code === 'auth/email-already-in-use') {
        setMessageType(showMessage('Email Address Already Exists!', setError, 'error'));
      } else {
        setMessageType(showMessage(`Unable to create user: ${error.message}`, setError, 'error'));
      }
    }
  };

  if (showMFAPrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} p-8 rounded-lg shadow-xl max-w-md mx-auto`}>
          <h2 className="text-2xl font-bold mb-4">Two-Factor Authentication</h2>
          <p className="mb-4">Please enter the verification code sent to your phone.</p>
          
          <form onSubmit={handleMFAVerification} className="space-y-4">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter verification code"
              className={`w-full px-3 py-2 border rounded-lg ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            >
              Verify
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://railmadad-dashboard.web.app/assets/body-bg-BM5rPYaf.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="container mx-auto px-4 flex">
        {/* Left Panel */}
        <div className="hidden lg:flex lg:w-1/2 text-white flex-col justify-center pr-16">
          <div className="flex items-center gap-4 mb-6">
            <img src="https://railmadad-dashboard.web.app/assets/train-DBEUZT8P.png" alt="Rail Madad Logo" className="w-12 h-12" />
            <h1 className="text-4xl font-bold">Rail Madad Portal</h1>
          </div>
          <p className="text-lg mb-8 opacity-90">
            Welcome to the Rail Madad portal. This secure platform is designed to assist all users—whether you're a passenger, client, or admin.
            It enables you to easily submit inquiries, address grievances, and receive assistance for a smoother travel experience.
          </p>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <img
                key={num}
                src={`https://railmadad.indianrailways.gov.in/madad/final/images/booking-icon-${num === 8 ? 2 : num}.png`}
                alt={`Railway Icon ${num}`}
                className="w-12 h-12"
              />
            ))}
          </div>
        </div>

        {/* Right Panel - Login/Signup Form */}
        <div className="w-full lg:w-1/2 lg:pl-16">
          <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} p-8 rounded-lg shadow-xl max-w-md mx-auto`}>
            {!showForgotPassword && !showSignUp ? (
              <>
                <h2 className="text-2xl font-bold mb-2">Sign in to your account</h2>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>Access Rail Madad Dashboard</p>

                {error && (
                  <div 
                    ref={errorRef}
                    className={`p-3 rounded-lg mb-4 ${
                      messageType === 'success' 
                      ? 'bg-green-100 text-green-700'
                      : messageType === 'info'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-red-100 text-red-700'
                  }`}
                >
                  {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                      Email address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 
                        ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                      required
                    />
                  </div>
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    label="Password"
                    required
                  />
                  <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                      Phone Number (with country code)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91XXXXXXXXXX"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 
                          ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                      />
                      <button
                        type="button"
                        onClick={handlePhoneSignIn}
                        className="whitespace-nowrap bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                      >
                        Send Code
                      </button>
                    </div>
                  </div>
                  
                  {/* Place recaptcha container here */}
                  <div id="recaptcha-container" className="flex justify-center"></div>
                  
                  {verificationId && (
                    <div>
                      <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                        Verification Code
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 
                            ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                        />
                        <button
                          type="button"
                          onClick={handlePhoneVerification}
                          className="whitespace-nowrap bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-indigo-500 hover:text-indigo-400"
                  >
                    Forgot password?
                  </button>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Sign in
                  </button>
                </form>

                <div className="my-6 flex items-center">
                  <div className={`flex-1 border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}></div>
                  <span className={`px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Or continue with</span>
                  <div className={`flex-1 border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}></div>
                </div>

                <button
                  onClick={handleGoogleSignIn}
                  className={`w-full flex items-center justify-center gap-2 border py-2 rounded-lg 
                    ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  <GoogleIcon />
                  Sign in with Google
                </button>

                <p className={`mt-6 text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setShowSignUp(true)}
                    className="text-indigo-500 hover:text-indigo-400"
                  >
                    Sign up
                  </button>
                </p>
              </>
            ) : showSignUp ? (
              <>
                <h2 className="text-2xl font-bold mb-2">Create an account</h2>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>Join Rail Madad Dashboard</p>

                {error && (
                  <div className={`p-3 rounded-lg mb-4 ${
                    messageType === 'success' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={signUpData.name}
                      onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 
                        ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                      Email address
                    </label>
                    <input
                      type="email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 
                        ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={signUpData.phoneNumber}
                      onChange={(e) => setSignUpData({ ...signUpData, phoneNumber: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 
                        ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                      Gender *
                    </label>
                    <select
                      value={signUpData.gender}
                      onChange={(e) => setSignUpData({ ...signUpData, gender: e.target.value as 'male' | 'female' })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 
                        ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                      Address
                    </label>
                    <textarea
                      value={signUpData.address}
                      onChange={(e) => setSignUpData({ ...signUpData, address: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 
                        ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                      rows={3}
                    />
                  </div>
                  <PasswordInput
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    label="Password"
                    required
                  />
                  <PasswordInput
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                    label="Confirm Password"
                    required
                  />
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                    >
                      Sign up
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSignUp(false)}
                      className={`flex-1 border py-2 rounded-lg 
                        ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                  Enter your email to reset your password
                </p>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                      Email address
                    </label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 
                        ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                      required
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                    >
                      Reset Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className={`flex-1 border py-2 rounded-lg 
                        ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              </>
            )}

            <div className="mt-8">
              <p className={`text-xs text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                By signing in, you agree to our{' '}
                <a href="#" className="text-indigo-500 hover:text-indigo-400">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-indigo-500 hover:text-indigo-400">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;