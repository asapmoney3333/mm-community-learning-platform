import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { LangProvider } from './context/LangContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

const basePath = import.meta.env.BASE_URL || '/'
const routerBasename =
  typeof window !== 'undefined' && window.location.pathname.startsWith(basePath)
    ? basePath
    : '/'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <LangProvider>
          <BrowserRouter basename={routerBasename}>
            <App />
          </BrowserRouter>
        </LangProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
