// Firebase initialization file

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyAql8ce63AtCMF0Ly9EcrZJZSlWk7blrXs",
  authDomain: "babyguard-64225.firebaseapp.com",
  projectId: "babyguard-64225",
  storageBucket: "babyguard-64225.appspot.com",
  messagingSenderId: "71843111532",
  appId: "1:71843111532:web:YOUR_APP_ID", // Replace with your actual appId from Firebase console
};

const app = initializeApp(firebaseConfig);

export default app;