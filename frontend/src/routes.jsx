import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ChatRoom from './pages/ChatRoom';

const AppRoutes = () => (
   <Router>
      <Routes>
         <Route path="/" element={<Login />} />
         <Route path="/chat" element={<ChatRoom />} />
      </Routes>
   </Router>
);

export default AppRoutes;
