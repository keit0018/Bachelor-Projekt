import React, { useState } from 'react';

const LoginForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
      });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    };

    return (
    <form className="form" onSubmit={handleSubmit}>
        <div className={`text_field ${formData.username? 'has-content' : ''}`}>
        <input
            type="username"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
        />
        <label htmlFor="username">username</label>
        </div>
        <div className={`text_field ${formData.password ? 'has-content' : ''}`}>
        <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
        />
        <label htmlFor="password">Password</label>
        </div>
        <div className="pass">Forgot password?</div>
        <button type="submit">Login</button>
        <div className="signup_link">
        Not a member? <a href="#">SignUp</a>
        </div>
    </form>
    );
};

export default LoginForm;