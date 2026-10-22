import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configurazione pubblica del progetto Firebase (non è un segreto: la
// protezione reale sta nelle regole di Firestore e nel Worker OAuth).
const firebaseConfig = {
  apiKey: 'AIzaSyBrBkzLE_0MLQEXB9YBDW7G05n6aI_ykA0',
  authDomain: 'polizia-iprp.firebaseapp.com',
  projectId: 'polizia-iprp',
  storageBucket: 'polizia-iprp.firebasestorage.app',
  messagingSenderId: '295622243589',
  appId: '1:295622243589:web:abfd6d06dac2f95428f36c',
  measurementId: 'G-V4SZTQVN7J',
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const DISCORD_AUTH_WORKER_URL = 'https://pds-discord-oauth.ryzedev63131.workers.dev/discord-auth';
export const DISCORD_CLIENT_ID = '1543034109146959882';
