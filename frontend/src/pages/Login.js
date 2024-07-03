import React from 'react';
import SignInForm from '../components/SignInForm'; // Import the LoginForm component
import axios from 'axios';
import '../assets/styles/FormContainer.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = ({ setAuthenticated, setUserRole, setCommunicationUserId }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (formData) => {
    try {
      const response = await axios.post('https://localhost:5000/api/users/login', formData);


      if (response.status === 200) {

        console.log(response.data);
        
        const { token, role, communicationUserId, username } = response.data;
        localStorage.setItem('communicationUserId', communicationUserId);
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        setAuthenticated(true);
        console.log(role);
        setUserRole(role);
        setCommunicationUserId(communicationUserId);
        console.log(communicationUserId);
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