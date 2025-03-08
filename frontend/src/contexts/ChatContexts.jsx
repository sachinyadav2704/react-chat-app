import React, { createContext, useContext, useState } from 'react';
import defaultProfilePic from '../assets/images/profile_pic.avif';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
   const storedUser = JSON.parse(localStorage.getItem('user')) || {};
   const [userId, setUserId] = useState(storedUser.id || null);
   const [userName, setUserName] = useState(storedUser.name || null);
   const [email, setEmail] = useState(storedUser.email || null);
   const [profilePic, setProfilePic] = useState(storedUser.profilePic || 'https://img.freepik.com/premium-photo/bearded-man-illustration_665280-67047.jpg');
   const [activeChat, setActiveChat] = useState(null); // For private chats
   const [activeGroup, setActiveGroup] = useState(null); // For group chats

   const login = (id, name, email, pic) => {
      const user = { id, name, email, profilePic: pic };
      setUserId(id);
      setUserName(name);
      setEmail(email);
      setProfilePic(pic);
      localStorage.setItem('user', JSON.stringify(user));
   };

   const logout = () => {
      setUserId(null);
      setUserName(null);
      setEmail(null);
      setProfilePic(null);
      setActiveChat(null);
      setActiveGroup(null);
      localStorage.removeItem('user');
   };

   const updateProfilePic = pic => {
      setProfilePic(pic);
      const user = JSON.parse(localStorage.getItem('user'));
      user.profilePic = pic;
      localStorage.setItem('user', JSON.stringify(user));
   };

   return (
      <ChatContext.Provider
         value={{
            userId,
            userName,
            email,
            profilePic,
            activeChat,
            setActiveChat,
            activeGroup,
            setActiveGroup,
            login,
            logout,
            updateProfilePic,
         }}
      >
         {children}
      </ChatContext.Provider>
   );
};

export const useChatContext = () => useContext(ChatContext);
