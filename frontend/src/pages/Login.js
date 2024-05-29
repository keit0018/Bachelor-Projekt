import React from 'react';
import SignInForm from '../components/SignInForm'; // Import the LoginForm component
import '../assets/styles/FormContainer.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';

const Login = ({ setAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    const { username, password } = formData;
    // Add logic to verify username and password with your backend
    // For now, we'll just set authenticated to true for demonstration
    if (username === 'admin' && password === 'password') {
      setAuthenticated(true);
      navigate('/dashboard');
    } else {
      alert('Invalid credentials');
    }
    // Handle login form submission here, e.g., call an authentication service
    console.log('Form submitted:', formData);
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <SignInForm onSubmit={handleLogin} />
    </div>
  );
};

export default Login;