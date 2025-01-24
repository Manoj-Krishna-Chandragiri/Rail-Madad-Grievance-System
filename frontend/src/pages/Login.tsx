import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '../components/icons/GoogleIcon';
import { useTheme } from '../context/ThemeContext';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";

interface SignUpData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
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
            className={`transition-transform ${showPassword ? 'opacity-70' : ''}`}
          >
            <path 
              fill="currentColor"
              fillRule="evenodd" 
              d="M7.119 14.563L5.982 16.53l-1.732-1 1.301-2.253A8.97 8.97 0 0 1 3 7h2a7 7 0 0 0 14 0h2a8.973 8.973 0 0 1-2.72 6.448l1.202 2.083-1.732 1-1.065-1.845A8.944 8.944 0 0 1 13 15.946V18h-2v-2.055a8.946 8.946 0 0 1-3.881-1.382z"
            />
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
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

const showMessage = (message: string, setError: React.Dispatch<React.SetStateAction<string>>) => {
  setError(message);
  setTimeout(() => {
    setError('');
  }, 5000);
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
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        showMessage('Login is successful', setError);
        const user = userCredential.user;
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/');
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/invalid-credential') {
          showMessage('Incorrect Email or Password', setError);
        } else {
          showMessage('Account does not exist', setError);
        }
      });
  };

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/');
      })
      .catch((error) => {
        const errorMessage = error.message;
        if (error.code === 'auth/operation-not-allowed') {
          showMessage('Google Sign-In is not enabled. Please enable it in Firebase Authentication settings.', setError);
        } else {
          console.error("Error during Google Sign-In", error);
          showMessage('Google Sign-In failed: ' + errorMessage, setError);
        }
      });
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        setShowForgotPassword(false);
        setError('Password reset link sent to your email');
      })
      .catch((error) => {
        console.error("Error sending password reset email", error);
        showMessage('Failed to send password reset email', setError);
      });
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    createUserWithEmailAndPassword(auth, signUpData.email, signUpData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
          email: signUpData.email,
          name: signUpData.name
        };
        showMessage('Account Created Successfully', setError);
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
          .then(() => {
            setShowSignUp(false);
            setError('Account created successfully! Please sign in.');
          })
          .catch((error) => {
            console.error("Error writing document", error);
            showMessage('Unable to create user', setError);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
          showMessage('Email Address Already Exists !!!', setError);
        } else {
          showMessage('Unable to create user', setError);
        }
      });
  };

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

                {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

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

                {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

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