import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { LangueProvider } from './context/LangueContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
//import { OTPProvider } from './context/OTPContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <LangueProvider>
        <AuthProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
        </AuthProvider>
      </LangueProvider>
    </ThemeProvider>
  </StrictMode>,
)