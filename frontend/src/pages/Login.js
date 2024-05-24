import React from 'react';
import SignInForm from '../components/SignInForm'; // Import the LoginForm component
import '../assets/styles/FormContainer.css'; // Import the CSS file for styling

const Login = () => {
  const handleLogin = (formData) => {
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