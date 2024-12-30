import { Modal, Input, Select, Button, message } from 'antd';
import { useState } from 'react';
import axios from 'axios';

const { Option } = Select;

const CreateChatroomModal = ({ visible, onClose, onChatroomCreated }) => {
   const [name, setName] = useState('');
   const [type, setType] = useState('group');
   const [participants, setParticipants] = useState([]);

   const handleCreate = async () => {
      if (!name || !type) {
         message.error('Name and type are required.');
         return;
      }

      try {
         const response = await axios.post('http://localhost:5000/api/chatrooms/create', {
            name,
            type,
            participants, // Optional
         });
         message.success('Chatroom created successfully!');
         onChatroomCreated(response.data); // Callback to refresh the chatroom list
         onClose();
      } catch (error) {
         message.error('Failed to create chatroom');
      }
   };

   return (
      <Modal visible={visible} title="Create Chatroom" onCancel={onClose} footer={null}>
         <Input placeholder="Chatroom Name" value={name} onChange={e => setName(e.target.value)} style={{ marginBottom: '10px' }} />
         <Select defaultValue="group" style={{ width: '100%', marginBottom: '10px' }} onChange={value => setType(value)}>
            <Option value="global">Global</Option>
            <Option value="private">Private</Option>
            <Option value="group">Group</Option>
         </Select>
         {type !== 'global' && (
            <Input
               placeholder="Participants (comma-separated IDs)"
               value={participants}
               onChange={e => setParticipants(e.target.value.split(','))}
               style={{ marginBottom: '10px' }}
            />
         )}
         <Button type="primary" onClick={handleCreate}>
            Create Chatroom
         </Button>
      </Modal>
   );
};

export default CreateChatroomModal;
