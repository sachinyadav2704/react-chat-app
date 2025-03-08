import React, { useState } from 'react';
import { Modal, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useChatContext } from '../contexts/ChatContexts';

const UpdateProfilePic = ({ visible, onClose }) => {
   const { userId, updateProfilePic } = useChatContext();
   const [file, setFile] = useState(null);

   const handleUpload = async () => {
      if (!file) {
         message.error('Please select a file to upload');
         return;
      }

      const formData = new FormData();
      formData.append('profilePic', file);
      formData.append('userId', userId);

      try {
         const response = await axios.put('http://localhost:5000/api/users/update-profile-pic', formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         message.success('Profile picture updated successfully');
         updateProfilePic(response.data.profilePic);
         onClose();
      } catch (error) {
         console.error('Error updating profile picture:', error);
         message.error('Error updating profile picture');
      }
   };

   const handleFileChange = ({ file }) => {
      setFile(file.originFileObj);
   };

   return (
      <Modal open={visible} title="Update Profile Picture" onCancel={onClose} onOk={handleUpload}>
         <Upload beforeUpload={() => false} onChange={handleFileChange}>
            <Button icon={<UploadOutlined />}>Select File</Button>
         </Upload>
      </Modal>
   );
};

export default UpdateProfilePic;
