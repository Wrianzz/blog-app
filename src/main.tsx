import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { account } from "./lib/appwrite";

async function testAppwrite() {
  try {
    const me = await account.get();
    console.log("Connected. Logged in user:", me);
  } catch (err) {
    console.log("Appwrite reachable, but no active session yet:", err);
  }
}

testAppwrite();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
