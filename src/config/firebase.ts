import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase yapılandırma
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCbnQ0B43jDN-apepuLqxdClcL4g_O9GO0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "todo-list-app-c083c.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "todo-list-app-c083c",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "todo-list-app-c083c.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "241565667434",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:241565667434:web:adb29249241218a0b4ba13"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Firestore ve Auth servislerini al
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;

