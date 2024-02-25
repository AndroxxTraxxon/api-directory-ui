import React from 'react';
import { Form, Field } from 'react-final-form';
import { useToast } from '../context/Toast';
import { useNavigate } from 'react-router-dom';

interface RequestPasswordResetFormValues {
  username: string
}

function RequestPasswordResetForm() {

  const { publish } = useToast();
  const navigate = useNavigate();

  async function onSubmit(values: RequestPasswordResetFormValues) {
    const response = await fetch(
      "https://apigateway.local/auth/v1/request-password-reset", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });
    if(!response.ok){
      const message = (await response.json()).error;
      publish({
        title: "Error",
        message,
        variant: 'error'
      });
    } else {
      publish({
        title: "Success",
        message: "Please check the appropriate channel for a message to reset your password.",
        variant: 'success'
      });
    }
  };

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username</label>
            <Field name="username" component="input" type="text" placeholder="Username" required />
          </div>
          <div className="buttons">
            <button type="submit" disabled={submitting}>
              Reset Password
            </button>
          </div>
        </form>
      )}
    />
  );
};

export default RequestPasswordResetForm;
