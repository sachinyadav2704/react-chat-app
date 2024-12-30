import React, { useState } from 'react';
import { Tabs, Form, Input, Button, Typography, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;
const { Link } = Typography;

const Login = () => {
   const [activeTab, setActiveTab] = useState('login');
   const navigate = useNavigate();

   const handleTabChange = key => {
      setActiveTab(key);
   };

   const onLoginFinish = async values => {
      await axios
         .post('http://localhost:5000/api/auth/login', values)
         .then(response => {
            console.log('Login Response: ' + response);
            const { user, token } = response.data;
            localStorage.setItem('userId', user._id); // Store user ID
            localStorage.setItem('userName', user.userName); // Store userName
            localStorage.setItem('token', token); // Optional, for authentication
            message.success('Login successful!');
            navigate('/chat'); // Redirect to chat page
         })
         .catch(error => {
            console.error('Login error: ', error);
            message.error('Login failed, please try again.');
         });
   };

   const onSignupFinish = async values => {
      delete values.confirmPassword;
      await axios
         .post('http://localhost:5000/api/auth/signup', values)
         .then(response => {
            console.log('Sign up Response: ' + response);
            setActiveTab('login');
            message.success(response?.data?.message);
         })
         .catch(error => {
            console.error('Signup error: ', error);
            message.error(error?.response?.data?.message || 'Sign up failed! Please try again');
         });
   };

   return (
      <div style={styles.container}>
         <div style={styles.formContainer}>
            <Tabs activeKey={activeTab} onChange={handleTabChange} centered>
               <TabPane tab="Login" key="login">
                  <Form onFinish={onLoginFinish} layout="vertical" style={styles.form}>
                     <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email!' }]}>
                        <Input type="email" placeholder="Email Address" />
                     </Form.Item>
                     <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password!' }]}>
                        <Input.Password placeholder="Password" />
                     </Form.Item>
                     <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                           Login
                        </Button>
                     </Form.Item>
                  </Form>
               </TabPane>
               <TabPane tab="Signup" key="signup">
                  <Form onFinish={onSignupFinish} layout="vertical" style={styles.form}>
                     <Form.Item name="userName" rules={[{ required: true, message: 'Please enter your name!' }]}>
                        <Input placeholder="Name" />
                     </Form.Item>
                     <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email!' }]}>
                        <Input type="email" placeholder="Email Address" />
                     </Form.Item>
                     <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password!' }]}>
                        <Input.Password placeholder="Password" />
                     </Form.Item>
                     <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                           {
                              required: true,
                              message: 'Please confirm your password!',
                           },
                           ({ getFieldValue }) => ({
                              validator(_, value) {
                                 if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                 }
                                 return Promise.reject(new Error('Passwords do not match!'));
                              },
                           }),
                        ]}
                     >
                        <Input.Password placeholder="Confirm Password" />
                     </Form.Item>
                     <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                           Signup
                        </Button>
                     </Form.Item>
                  </Form>
               </TabPane>
            </Tabs>
         </div>
      </div>
   );
};

const styles = {
   container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f4f4f4',
   },
   formContainer: {
      width: 400,
      padding: '24px',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)',
   },
   form: {
      maxWidth: '100%',
   },
   link: {
      color: '#1890ff',
      cursor: 'pointer',
   },
};

export default Login;
