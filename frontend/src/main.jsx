import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'antd/dist/reset.css'; // Import Ant Design styles
import './styles/global.css'; // Custom global styles
import { ChatProvider } from './contexts/ChatContexts';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
   <React.StrictMode>
      <ChatProvider>
         <App />
      </ChatProvider>
   </React.StrictMode>
);
