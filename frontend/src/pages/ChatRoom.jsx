// import React, { useState, useEffect } from 'react';
// import { Input, Button, List, Typography, Select, message, Modal } from 'antd';
// import { io } from 'socket.io-client';
// import { LuSend } from 'react-icons/lu';
// import { IoMdLogOut } from 'react-icons/io';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import dayjs from 'dayjs';
// import CreateChatroomModal from './CreateChatroomModal';

// const { Text } = Typography;
// const { Option } = Select;

// const ChatRoom = () => {
//    const [socket, setSocket] = useState(null);
//    const [messageInput, setMessageInput] = useState('');
//    const [messages, setMessages] = useState([]);
//    const [currentUser, setCurrentUser] = useState({ id: null, name: null });
//    const [chatrooms, setChatrooms] = useState([]);
//    const [selectedChatroom, setSelectedChatroom] = useState('global');
//    const [isModalVisible, setIsModalVisible] = useState(false);
//    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
//    const [password, setPassword] = useState('');
//    const [chatroomToJoin, setChatroomToJoin] = useState(null);
//    const navigate = useNavigate();

//    useEffect(() => {
//       // Fetch current user details from localStorage
//       const userId = localStorage.getItem('userId');
//       const userName = localStorage.getItem('userName');
//       setCurrentUser({ id: userId, name: userName });

//       // Fetch available chatrooms (global, private, group)
//       const fetchChatrooms = async () => {
//          try {
//             const response = await axios.get('http://localhost:5000/api/chatrooms');
//             setChatrooms(response.data);
//          } catch (error) {
//             console.error('Error fetching chatrooms:', error);
//          }
//       };

//       fetchChatrooms();

//       // Connect to WebSocket server
//       const newSocket = io('http://localhost:5000');
//       setSocket(newSocket);

//       return () => {
//          newSocket.close();
//       };
//    }, []);

//    useEffect(() => {
//       // Listen for messages
//       if (socket) {
//          const messageListener = newMessage => {
//             setMessages(prevMessages => [...prevMessages, newMessage]);
//          };
//          socket.on('message', messageListener);

//          return () => {
//             socket.off('message', messageListener);
//          };
//       }
//    }, [socket]);

//    useEffect(() => {
//       // Fetch chat history for the selected chatroom
//       const fetchMessages = async () => {
//          try {
//             const response = await axios.get(`http://localhost:5000/api/chat/${selectedChatroom}`);
//             setMessages(response.data);
//          } catch (error) {
//             console.error('Error fetching messages:', error);
//          }
//       };

//       if (selectedChatroom) {
//          fetchMessages();
//       }
//    }, [selectedChatroom]);

//    const handleSendMessage = () => {
//       if (messageInput.trim()) {
//          const messageData = {
//             sender: currentUser.id,
//             senderName: currentUser.name,
//             chatroom: selectedChatroom,
//             content: messageInput,
//             timestamp: new Date().toISOString(),
//          };

//          socket.emit('message', messageData);
//          setMessageInput('');
//       } else {
//          message.error('Please enter a message.');
//       }
//    };

//    const handleLogout = () => {
//       localStorage.removeItem('userId');
//       localStorage.removeItem('userName');
//       localStorage.removeItem('token');
//       navigate('/');
//    };

//    const handleChatroomChange = async value => {
//       const selectedRoom = chatrooms.find(room => room._id === value);
//       if (selectedRoom && selectedRoom.type === 'private') {
//          setChatroomToJoin(value);
//          setIsPasswordModalVisible(true);
//       } else {
//          setSelectedChatroom(value);
//          setMessages([]); // Clear messages when switching chatrooms

//          try {
//             const response = await axios.get(`http://localhost:5000/api/chat/${value}`);
//             setMessages(response.data);
//          } catch (error) {
//             console.error('Error fetching messages:', error);
//          }

//          if (socket) {
//             socket.emit('join-room', value); // Notify the server to join the new chatroom
//          }
//       }
//    };

//    const handlePasswordSubmit = async () => {
//       try {
//          const response = await axios.post(`http://localhost:5000/api/chatrooms/verify-password`, {
//             chatroomId: chatroomToJoin,
//             password,
//          });

//          if (response.data.success) {
//             setSelectedChatroom(chatroomToJoin);
//             setMessages([]); // Clear messages when switching chatrooms

//             try {
//                const response = await axios.get(`http://localhost:5000/api/chat/${chatroomToJoin}`);
//                setMessages(response.data);
//             } catch (error) {
//                console.error('Error fetching messages:', error);
//             }

//             if (socket) {
//                socket.emit('join-room', chatroomToJoin); // Notify the server to join the new chatroom
//             }

//             setIsPasswordModalVisible(false);
//             setPassword('');
//          } else {
//             message.error('Incorrect password');
//             setChatroomToJoin('global');
//             setIsPasswordModalVisible(false);
//             setPassword('');
//          }
//       } catch (error) {
//          message.error('Failed to verify password');
//       }
//    };

//    const handleChatroomCreated = newChatroom => {
//       setChatrooms(prev => [...prev, newChatroom]);
//    };

//    return (
//       <div style={styles.container}>
//          <Button onClick={() => setIsModalVisible(true)} style={{ marginBottom: '10px' }}>
//             Create Chatroom
//          </Button>
//          <CreateChatroomModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} onChatroomCreated={handleChatroomCreated} />
//          <Button onClick={handleLogout} style={styles.logoutButton}>
//             Logout <IoMdLogOut />
//          </Button>
//          <div style={styles.header}>
//             <Select defaultValue={selectedChatroom} style={styles.chatroomSelect} onChange={handleChatroomChange}>
//                <Option value={'global'} key={'global'}>
//                   Global
//                </Option>
//                {chatrooms.map(room => (
//                   <Option key={room._id} value={room._id}>
//                      {room.name}
//                   </Option>
//                ))}
//             </Select>
//          </div>
//          <div style={styles.chatContainer}>
//             <List
//                bordered
//                dataSource={messages}
//                renderItem={item => (
//                   <List.Item>
//                      <div style={{ width: '100%' }}>
//                         <strong>{item.senderName || 'Anonymous'}:</strong> {item.content}
//                         <div style={{ fontSize: '8px', color: 'gray', float: 'right' }}>{item.timestamp ? dayjs(item.timestamp).format('HH:mm:ss A') : ''}</div>
//                      </div>
//                   </List.Item>
//                )}
//             />
//          </div>
//          <div style={styles.inputContainer}>
//             <Input
//                value={messageInput}
//                onChange={e => setMessageInput(e.target.value)}
//                onPressEnter={handleSendMessage}
//                placeholder="Type a message..."
//                style={styles.input}
//             />
//             <Button type="primary" onClick={handleSendMessage} style={styles.sendButton}>
//                Send <LuSend />
//             </Button>
//          </div>
//          <Modal title="Enter Password" visible={isPasswordModalVisible} onCancel={() => setIsPasswordModalVisible(false)} onOk={handlePasswordSubmit}>
//             <Input.Password placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
//          </Modal>
//       </div>
//    );
// };

// const styles = {
//    container: {
//       padding: '20px',
//       maxWidth: '600px',
//       margin: '0 auto',
//       height: '100vh',
//       display: 'flex',
//       flexDirection: 'column',
//    },
//    header: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       marginBottom: '10px',
//    },
//    chatroomSelect: {
//       width: '200px',
//    },
//    chatContainer: {
//       flex: 1,
//       overflowY: 'auto',
//    },
//    inputContainer: {
//       display: 'flex',
//       marginTop: '10px',
//    },
//    input: {
//       flex: 1,
//       marginRight: '10px',
//    },
//    sendButton: {
//       width: '100px',
//    },
//    logoutButton: {
//       position: 'absolute',
//       top: '20px',
//       right: '20px',
//    },
// };

// export default ChatRoom;

import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, List, Select, message, Modal } from 'antd';
import { io } from 'socket.io-client';
import { LuSend } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import CreateChatroomModal from './CreateChatroomModal';
import AppHeader from '../components/Header';
import { FaPlusCircle } from 'react-icons/fa';

const { Content } = Layout;
const { Option } = Select;

const ChatRoom = () => {
   const [socket, setSocket] = useState(null);
   const [messageInput, setMessageInput] = useState('');
   const [messages, setMessages] = useState([]);
   const [currentUser, setCurrentUser] = useState({ id: null, name: null, avatarUrl: null, email: null });
   const [chatrooms, setChatrooms] = useState([]);
   const [selectedChatroom, setSelectedChatroom] = useState('global');
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
   const [password, setPassword] = useState('');
   const [chatroomToJoin, setChatroomToJoin] = useState(null);
   const navigate = useNavigate();

   useEffect(() => {
      // Fetch current user details from localStorage
      let user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
         navigate('/');
      }
      const userId = user.id;
      const userName = user.name;
      const avatarUrl = user.profilePic;
      const email = user.email;
      // const userId = localStorage.getItem('userId');
      // const userName = localStorage.getItem('userName');
      // const avatarUrl = localStorage.getItem('avatarUrl'); // Assuming you store avatar URL in localStorage
      setCurrentUser({ id: userId, name: userName, avatarUrl, email });

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
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/');
   };

   const handleChatroomChange = async value => {
      const selectedRoom = chatrooms.find(room => room._id === value);
      if (selectedRoom && selectedRoom.type === 'private') {
         setChatroomToJoin(value);
         setIsPasswordModalVisible(true);
      } else {
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
      }
   };

   const handlePasswordSubmit = async () => {
      try {
         const response = await axios.post(`http://localhost:5000/api/chatrooms/verify-password`, {
            chatroomId: chatroomToJoin,
            password,
         });

         if (response.data.success) {
            setSelectedChatroom(chatroomToJoin);
            setMessages([]); // Clear messages when switching chatrooms

            try {
               const response = await axios.get(`http://localhost:5000/api/chat/${chatroomToJoin}`);
               setMessages(response.data);
            } catch (error) {
               console.error('Error fetching messages:', error);
            }

            if (socket) {
               socket.emit('join-room', chatroomToJoin); // Notify the server to join the new chatroom
            }

            setIsPasswordModalVisible(false);
            setPassword('');
         } else {
            message.error('Incorrect password');
         }
      } catch (error) {
         message.error('Failed to verify password');
      }
   };

   const handleChatroomCreated = newChatroom => {
      setChatrooms(prev => [...prev, newChatroom]);
   };

   return (
      <Layout style={{ height: '100vh' }}>
         <AppHeader userName={currentUser.name} avatarUrl={currentUser.avatarUrl} email={currentUser.email} onLogout={handleLogout} />
         <Content style={styles.container}>
            <CreateChatroomModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} onChatroomCreated={handleChatroomCreated} />
            <div style={(styles.header, { margin: '10px' })}>
               <Button type="primary" style={{ width: '45%' }} onClick={() => setIsModalVisible(true)}>
                  New Chatroom <FaPlusCircle style={{ fontSize: '1rem' }} />
               </Button>
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
                           <div style={{ fontSize: '8px', color: 'gray', float: 'right' }}>
                              {item.timestamp ? dayjs(item.timestamp).format('HH:mm:ss A') : ''}
                           </div>
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
                  Send <LuSend />
               </Button>
            </div>
            <Modal title="Enter Password" open={isPasswordModalVisible} onCancel={() => setIsPasswordModalVisible(false)} onOk={handlePasswordSubmit}>
               <Input.Password placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            </Modal>
         </Content>
      </Layout>
   );
};

const styles = {
   container: {
      padding: '20px',
      // maxWidth: '600px',
      margin: '0 auto',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      width: '95%',
   },
   header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      // marginBottom: '10px',
   },
   chatroomSelect: {
      width: '45%',
      float: 'right',
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
};

export default ChatRoom;
