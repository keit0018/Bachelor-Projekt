import React from 'react';
import SignInForm from '../components/SignInForm'; // Import the LoginForm component
import axios from 'axios';
import '../assets/styles/FormContainer.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';

const Login = ({ setAuthenticated, setUserRole }) => {
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', formData);


      if (response.status === 200) {

        console.log(response.data);
        
        const { token, role } = response.data;
        localStorage.setItem('token', token);
        setAuthenticated(true);
        console.log(role);
        setUserRole(role);
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