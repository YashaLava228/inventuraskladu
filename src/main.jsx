import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CloudApp from './CloudApp.jsx'

// Cloud beta is opt-in. The existing site stays the default until migration is verified.
const useCloudBeta = new URLSearchParams(window.location.search).get('cloud') === '1'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {useCloudBeta ? <CloudApp /> : <App />}
  </StrictMode>,
)
