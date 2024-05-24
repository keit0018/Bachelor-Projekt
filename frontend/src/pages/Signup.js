import React from 'react';
import SignUpForm from '../components/Signupform'; // Import the SignUpForm component
import '../assets/styles/FormContainer.css';

const SignUp = () => {
  const handleSignUp = (formData) => {
    // Handle signup form submission here, e.g., call an authentication service
    console.log('Form submitted:', formData);
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <SignUpForm onSubmit={handleSignUp} />
    </div>
  );
};

export default SignUp;