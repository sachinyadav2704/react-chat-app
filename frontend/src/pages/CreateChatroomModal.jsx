import { Modal, Input, Select, Button, message } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';

const { Option } = Select;

const CreateChatroomModal = ({ visible, onClose, onChatroomCreated }) => {
   const [name, setName] = useState('');
   const [type, setType] = useState('group');
   const [participants, setParticipants] = useState([]);
   const [password, setPassword] = useState('');
   const [users, setUsers] = useState([]);

   useEffect(() => {
      const fetchUsers = async () => {
         try {
            const response = await axios.get('http://localhost:5000/api/users/list');
            setUsers(response.data);
         } catch (error) {
            message.error('Failed to fetch users');
         }
      };

      fetchUsers();
   }, []);

   const handleCreate = async () => {
      if (!name || !type) {
         message.error('Name and type are required.');
         return;
      }

      if (type === 'group' && participants.length === 0) {
         message.error('Participants are required for group chatrooms.');
         return;
      }

      try {
         const payload = {
            name,
            type,
         };
         if (type === 'group') {
            payload.participants = participants;
         } else if (type === 'private') {
            payload.password = password;
         }
         const response = await axios.post('http://localhost:5000/api/chatrooms/create', payload);
         message.success('Chatroom created successfully!');
         onChatroomCreated(response.data); // Callback to refresh the chatroom list
         onClose();
      } catch (error) {
         message.error('Failed to create chatroom');
      }
   };

   return (
      <Modal open={visible} title="Create Chatroom" onCancel={onClose} footer={null}>
         <Input placeholder="Chatroom Name" value={name} onChange={e => setName(e.target.value)} style={{ marginBottom: '10px' }} />
         <Select defaultValue="group" style={{ width: '100%', marginBottom: '10px' }} onChange={value => setType(value)}>
            <Option value="global">Global</Option>
            <Option value="private">Private</Option>
            <Option value="group">Group</Option>
         </Select>
         {type === 'group' && (
            <Select
               mode="multiple"
               placeholder="Select Participants"
               value={participants}
               onChange={setParticipants}
               style={{ width: '100%', marginBottom: '10px' }}
            >
               {users.map(user => (
                  <Option key={user._id} value={user._id}>
                     {user.userName}
                  </Option>
               ))}
            </Select>
         )}
         {type === 'private' && (
            <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ marginBottom: '10px' }} />
         )}
         <Button type="primary" onClick={handleCreate}>
            Create Chatroom
         </Button>
      </Modal>
   );
};

export default CreateChatroomModal;
