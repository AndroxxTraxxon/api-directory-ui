import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from "../forms/Login";
import './Login.css'; // Import the CSS file here

function LoginPage() {
    return (
        <div className="login-page">
            <LoginForm />
            <p className="reset-password-link">
                Forgot your password? <Link to="/reset-password">Reset it here</Link>.
            </p>
        </div>
    );
};

export default LoginPage;
