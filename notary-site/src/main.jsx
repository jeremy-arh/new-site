import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Enable react-scan in development only
if (import.meta.env.DEV) {
  import('react-scan').then(({ scan }) => {
    scan({
      enabled: true,
      log: true,
    })
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
