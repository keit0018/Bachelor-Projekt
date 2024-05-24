import React, { useState } from 'react';

const LoginForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
      });
    
    const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    };

    return (
    <form className="form" onSubmit={handleSubmit}>
        <div className={`text_field ${formData.email ? 'has-content' : ''}`}>
        <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
        />
        <label htmlFor="email">Email</label>
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