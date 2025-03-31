import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ✅ 추가
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>  {/* 여기서 감싸줘야 <Link> 작동함 */}
      <App />
    </BrowserRouter>
  </StrictMode>
);
