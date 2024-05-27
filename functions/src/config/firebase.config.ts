import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  SERVICE_ACCOUNT_FILENAME,
  MESSAGING_SENDER_ID,
  APP_ID,
} = process.env;

export const serviceAccountPath = path.resolve(
  __dirname,
  '../..',
  SERVICE_ACCOUNT_FILENAME,
);

export const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};
