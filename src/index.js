import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import reportWebVitals from './reportWebVitals';
// chakra-Ui
import { Provider } from'./components/ui/provider';
import theme from './theme';
import CustomGlobalStyle from './style/global.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <Provider theme={theme}>
      <CustomGlobalStyle />
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </Provider>

);

reportWebVitals();
