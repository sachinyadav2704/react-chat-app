import React, { useState, useEffect } from 'react';
import { Input, Button, List, Typography, Select, message } from 'antd';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import CreateChatroomModal from './CreateChatroomModal';

const { Text } = Typography;
const { Option } = Select;

const ChatRoom = () => {
   const [socket, setSocket] = useState(null);
   const [messageInput, setMessageInput] = useState('');
   const [messages, setMessages] = useState([]);
   const [currentUser, setCurrentUser] = useState({ id: null, name: null });
   const [chatrooms, setChatrooms] = useState([]);
   const [selectedChatroom, setSelectedChatroom] = useState('global');
   const [isModalVisible, setIsModalVisible] = useState(false);
   const navigate = useNavigate();

   useEffect(() => {
      // Fetch current user details from localStorage
      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('userName');
      setCurrentUser({ id: userId, name: userName });

      // Fetch available chatrooms (global, private, group)
      const fetchChatrooms = async () => {
         try {
            const response = await axios.get('http://localhost:5000/api/chatrooms');
            setChatrooms(response.data);
         } catch (error) {
            console.error('Error fetching chatrooms:', error);
         }
      };

      fetchChatrooms();

      // Connect to WebSocket server
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);

      return () => {
         newSocket.close();
      };
   }, []);

   useEffect(() => {
      // Listen for messages
      if (socket) {
         const messageListener = newMessage => {
            setMessages(prevMessages => [...prevMessages, newMessage]);
         };
         socket.on('message', messageListener);

         return () => {
            socket.off('message', messageListener);
         };
      }
   }, [socket]);

   useEffect(() => {
      // Fetch chat history for the selected chatroom
      const fetchMessages = async () => {
         try {
            const response = await axios.get(`http://localhost:5000/api/chat/${selectedChatroom}`);
            setMessages(response.data);
         } catch (error) {
            console.error('Error fetching messages:', error);
         }
      };

      if (selectedChatroom) {
         fetchMessages();
      }
   }, [selectedChatroom]);

   const handleSendMessage = () => {
      if (messageInput.trim()) {
         const messageData = {
            sender: currentUser.id,
            senderName: currentUser.name,
            chatroom: selectedChatroom,
            content: messageInput,
            timestamp: new Date().toISOString(),
         };

         socket.emit('message', messageData);
         setMessageInput('');
      } else {
         message.error('Please enter a message.');
      }
   };

   const handleLogout = () => {
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('token');
      navigate('/');
   };

   const handleChatroomChange = async value => {
      setSelectedChatroom(value);
      setMessages([]); // Clear messages when switching chatrooms

      try {
         const response = await axios.get(`http://localhost:5000/api/chat/${value}`);
         setMessages(response.data);
      } catch (error) {
         console.error('Error fetching messages:', error);
      }

      if (socket) {
         socket.emit('join-room', value); // Notify the server to join the new chatroom
      }
   };

   const handleChatroomCreated = newChatroom => {
      setChatrooms(prev => [...prev, newChatroom]);
   };

   return (
      <div style={styles.container}>
         <Button onClick={() => setIsModalVisible(true)} style={{ marginBottom: '10px' }}>
            Create Chatroom
         </Button>
         <CreateChatroomModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} onChatroomCreated={handleChatroomCreated} />
         <Button onClick={handleLogout} style={styles.logoutButton}>
            Logout
         </Button>
         <div style={styles.header}>
            <Select defaultValue={selectedChatroom} style={styles.chatroomSelect} onChange={handleChatroomChange}>
               <Option value={'global'} key={'global'}>
                  Global
               </Option>
               {chatrooms.map(room => (
                  <Option key={room._id} value={room._id}>
                     {room.name}
                  </Option>
               ))}
            </Select>
         </div>
         <div style={styles.chatContainer}>
            <List
               bordered
               dataSource={messages}
               renderItem={item => (
                  <List.Item>
                     <div style={{ width: '100%' }}>
                        <strong>{item.senderName || 'Anonymous'}:</strong> {item.content}
                        <div style={{ fontSize: '8px', color: 'gray', float: 'right' }}>{item.timestamp ? dayjs(item.timestamp).format('HH:mm:ss A') : ''}</div>
                     </div>
                  </List.Item>
               )}
            />
         </div>
         <div style={styles.inputContainer}>
            <Input
               value={messageInput}
               onChange={e => setMessageInput(e.target.value)}
               onPressEnter={handleSendMessage}
               placeholder="Type a message..."
               style={styles.input}
            />
            <Button type="primary" onClick={handleSendMessage} style={styles.sendButton}>
               Send
            </Button>
         </div>
      </div>
   );
};

const styles = {
   container: {
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      height: '80vh',
      display: 'flex',
      flexDirection: 'column',
   },
   header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
   },
   chatroomSelect: {
      width: '200px',
   },
   chatContainer: {
      flex: 1,
      overflowY: 'auto',
   },
   inputContainer: {
      display: 'flex',
      marginTop: '10px',
   },
   input: {
      flex: 1,
      marginRight: '10px',
   },
   sendButton: {
      width: '100px',
   },
   logoutButton: {
      position: 'absolute',
      top: '20px',
      right: '20px',
   },
};

export default ChatRoom;
