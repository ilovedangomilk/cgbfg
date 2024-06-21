// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import './index.css';
import App from './App';
import theme from './theme'; // Import your custom theme
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}> {/* Pass the custom theme to ChakraProvider */}
      <App />
    </ChakraProvider>
  </React.StrictMode>
);

reportWebVitals();
