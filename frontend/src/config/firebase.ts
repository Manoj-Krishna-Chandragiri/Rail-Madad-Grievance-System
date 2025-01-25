import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // ...existing config...
  authDomain: "your-project-id.firebaseapp.com",
  // ...existing config...
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
