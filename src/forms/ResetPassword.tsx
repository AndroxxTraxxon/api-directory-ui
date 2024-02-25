import React from 'react';
import { Form, Field } from 'react-final-form';
import { useToast } from '../context/Toast';
import { useNavigate } from 'react-router-dom';

interface ResetPasswordFormProps {
  token: string;
}

interface ResetPasswordFormValues {
  username: string,
  newPassword: string,
  confirmPassword: string
}

function ResetPasswordForm({token}: ResetPasswordFormProps){
  const navigate = useNavigate();
  const { publish } = useToast();

  async function onSubmit(values: ResetPasswordFormValues) {
    const response = await fetch(
      "https://apigateway.local/auth/v1/reset-password/" + token, {
      method: "PATCH",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: values.username,
        password: values.newPassword
      })
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
        message: "Your password was successfully reset",
        variant: 'success'
      });
      return navigate("/login");
    }
  };

  function validate(values){
    const errors: any = {};
    // Check if passwords match
    if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = "Passwords must match";
    }
    // Add more validation as needed
    return errors;
  };

  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      render={({ handleSubmit, submitting}) => (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username</label>
            <Field name="username" component="input" type="text" placeholder="Username" required />
          </div>
          <div>
            <label>New Password</label>
            <Field name="newPassword" component="input" type="password" placeholder="New Password" required />
          </div>
          <div>
            <label>Confirm New Password</label>
            <Field name="confirmPassword" component="input" type="password" placeholder="Confirm New Password" required />
            <Field name="confirmPassword" subscription={{ touched: true, error: true }}>
              {({ meta }) => meta.touched && meta.error && <span>{meta.error}</span>}
            </Field>
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

export default ResetPasswordForm;
