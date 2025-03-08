import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Modal } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { IoMenu } from 'react-icons/io5';
import '../styles/Header.css';
import AvatarUrl from '../assets/images/profile_pic.avif';
import UpdateProfilePic from './UpdateProfilePic';

const { Header } = Layout;

const AppHeader = ({ userName, avatarUrl, email, onLogout }) => {
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
   const navigate = useNavigate();

   const handleLogout = () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      onLogout();
      navigate('/');
   };

   const menu = (
      <div>
         {email && <p style={{ textAlign: 'center', margin: '0', padding: '10px' }}>{email}</p>}
         <Menu>
            <Menu.Item key="logout" onClick={handleLogout}>
               <LogoutOutlined /> Logout
            </Menu.Item>
         </Menu>
      </div>
   );

   const handleAvatarClick = () => {
      setIsModalVisible(true);
   };

   const handleModalClose = () => {
      setIsModalVisible(false);
   };

   const handleUpdateClick = () => {
      setIsUpdateModalVisible(true);
   };

   const handleUpdateModalClose = () => {
      setIsUpdateModalVisible(false);
   };

   return (
      <>
         <Header className="header">
            <div className="logo">Chat App</div>
            <div className="user-info">
               <Avatar src={avatarUrl || AvatarUrl} icon={<UserOutlined />} onClick={handleAvatarClick} style={{ cursor: 'pointer' }} />
               <span className="user-name">{userName}</span>
               <Dropdown overlay={menu} trigger={['click']}>
                  <Button type="link" icon={<IoMenu style={{ fontSize: '1.5rem', color: 'white' }} />} />
               </Dropdown>
            </div>
         </Header>
         <Modal open={isModalVisible} footer={null} onCancel={handleModalClose}>
            <div style={{ textAlign: 'center' }}>
               <img src={avatarUrl || AvatarUrl} alt="Avatar" style={{ width: '50%' }} />
               <Button type="primary" onClick={handleUpdateClick} style={{ marginTop: '10px' }}>
                  Update Profile Picture
               </Button>
            </div>
         </Modal>
         <UpdateProfilePic visible={isUpdateModalVisible} onClose={handleUpdateModalClose} />
      </>
   );
};

export default AppHeader;
