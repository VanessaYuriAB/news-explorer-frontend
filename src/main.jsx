import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './contexts/AuthProvider';
import PopupsProvider from './contexts/PopupsProvider';
import App from './components/App/App.jsx';
import NewsProvider from './contexts/NewsProvider';
import UserProvider from './contexts/UserProvider';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PopupsProvider>
        <AuthProvider>
          <UserProvider>
            <NewsProvider>
              <App />
            </NewsProvider>
          </UserProvider>
        </AuthProvider>
      </PopupsProvider>
    </BrowserRouter>
  </StrictMode>,
);
