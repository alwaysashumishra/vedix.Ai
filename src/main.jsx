import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ContextProvider from './context/context.jsx'
import { BrowserRouter } from 'react-router-dom'


createRoot(document.getElementById('root')).render(
  <ContextProvider>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </ContextProvider>,
)
