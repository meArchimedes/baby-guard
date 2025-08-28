// Firebase initialization file

import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAql8ce63AtCMF0Ly9EcrZJZSlWk7blrXs",
  authDomain: "babyguard-64225.firebaseapp.com",
  projectId: "babyguard-64225",
  storageBucket: "babyguard-64225.appspot.com",
  messagingSenderId: "71843111532",
  appId: "1:71843111532:web:YOUR_APP_ID", // Replace with your actual appId from Firebase console
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set session persistence (user will be signed out when browser closes)
setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.log('Persistence error:', error);
});

export default app;