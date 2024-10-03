// firebase-config.ts
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { config as envConfig } from 'dotenv';

envConfig();
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL_FIREBASE,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
