import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import './index.css'
import App from './App.jsx'

// Safely suppress third-party browser extension message channel errors from polluting console
window.addEventListener('unhandledrejection', (event) => {
  if (
    event?.reason?.message?.includes('A listener indicated an asynchronous response') ||
    event?.reason?.message?.includes('message channel closed')
  ) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
