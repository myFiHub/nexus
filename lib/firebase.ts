import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let firebaseApp: any = null;
let firebaseStorage: any = null;

// Lazy initialization to avoid SSR issues
const initializeFirebase = () => {
  if (typeof window === "undefined") {
    // Server-side rendering - return null
    return null;
  }

  if (!firebaseApp) {
    console.log("Initializing Firebase");
    firebaseApp = initializeApp(firebaseConfig);
    firebaseStorage = getStorage(firebaseApp);
  }

  return { app: firebaseApp, storage: firebaseStorage };
};

// Get Firebase Storage instance
export const getFirebaseStorage = () => {
  const firebase = initializeFirebase();
  return firebase?.storage;
};

// Get Firebase App instance
export const getFirebaseApp = () => {
  const firebase = initializeFirebase();
  return firebase?.app;
};

// Check if Firebase is properly configured
export const isFirebaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  );
};
