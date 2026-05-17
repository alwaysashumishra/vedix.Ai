import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import ContextProvider from './context/context.jsx';
import { BrowserRouter } from 'react-router-dom';

import ThemeProvider from './context/ThemeContext.jsx';

createRoot(document.getElementById('root')).render(

  <ThemeProvider>

    <ContextProvider>

      <BrowserRouter>
        <App />
      </BrowserRouter>

    </ContextProvider>

  </ThemeProvider>
);