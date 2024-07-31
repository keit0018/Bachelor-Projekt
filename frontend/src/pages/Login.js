import React from 'react';
import SignInForm from '../components/SignInForm'; // Import the LoginForm component
import axios from 'axios';
import '../assets/styles/FormContainer.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = ({ setAuthenticated, setUserRole, setCommunicationUserId }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const baseURL = process.env.REACT_APP_BACKEND_API_URL;

  const handleLogin = async (formData) => {
    try {
      const response = await axios.post(`${baseURL}/api/users/login`, formData);


      if (response.status === 200) {
        const { token, role, communicationUserId, username, userId } = response.data;
        localStorage.setItem('communicationUserId', communicationUserId);
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('userId', userId);
        setAuthenticated(true);
        setUserRole(role);
        setCommunicationUserId(communicationUserId);
        login({ communicationUserId, username });
        navigate('/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <SignInForm onSubmit={handleLogin} />
    </div>
  );
};

export default Login;