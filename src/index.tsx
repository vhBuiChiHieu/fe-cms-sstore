import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import logger from './utils/logger';

// Import Roboto font - sử dụng đường dẫn chính xác
import '@fontsource/roboto';

// Cấu hình logger dựa trên môi trường
if (process.env.NODE_ENV === 'production') {
  logger.setupForProduction();
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals((metric) => {
  logger.debug('Web Vital:', metric);
});
