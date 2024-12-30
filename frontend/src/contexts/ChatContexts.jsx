// ChatContexts.jsx

import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
   const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
   const [userName, setUserName] = useState(localStorage.getItem('userName') || null);
   const [activeChat, setActiveChat] = useState(null); // For private chats
   const [activeGroup, setActiveGroup] = useState(null); // For group chats

   const login = (id, name) => {
      setUserId(id);
      setUserName(name);
      localStorage.setItem('userId', id);
      localStorage.setItem('userName', name);
   };

   const logout = () => {
      setUserId(null);
      setUserName(null);
      setActiveChat(null);
      setActiveGroup(null);
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
   };

   return (
      <ChatContext.Provider
         value={{
            userId,
            userName,
            activeChat,
            setActiveChat,
            activeGroup,
            setActiveGroup,
            login,
            logout,
         }}
      >
         {children}
      </ChatContext.Provider>
   );
};

export const useChatContext = () => useContext(ChatContext);
