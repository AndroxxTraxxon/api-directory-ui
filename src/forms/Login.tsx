import React, { useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { useAuth } from '../context/Auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/Toast';
import './Login.css';

type LoginFormValues = {
  username: string,
  password: string,
};

function LoginForm(){
  const navigate = useNavigate();
  const { login, claims } = useAuth();
  const { publish } = useToast();

  useEffect(() => {
    if(claims !== null) {
      return navigate("/");
    }
  }, []);

  async function onSubmit(values: LoginFormValues){
    const response = await fetch('https://apigateway.local/auth/v1/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: values.username,
        password: values.password,
      }),
    });

    if (!response.ok) {
      const message = (await response.json()).error;
      console.error(message);
      publish({
        title: "Failed to log in",
        message,
        variant: 'error'
      })
      return false;
    }

    login(await response.text()); // Save the auth token using the context's login method
    return navigate("/");
  };

  return (
    <div className="login-container">
      <h2>API Gateway Login</h2>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Field name="username" component="input" type="text" placeholder="Username" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field name="password" component="input" type="password" placeholder="Password" required />
            </div>
            <button type="submit">Login</button>
          </form>
        )}
      />
    </div>
  );
};

export default LoginForm;
