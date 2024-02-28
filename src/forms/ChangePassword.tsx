import React from 'react';
import { Form, Field } from 'react-final-form';
import { useToast } from '../context/Toast';
import { useAuth } from '../context/Auth';

interface ChangePasswordFormValues {
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
}

function ChangePasswordForm(){
  const { authFetch } = useAuth();
  const { publish } = useToast();

  async function onSubmit(values: ChangePasswordFormValues, form) {
    const response = await authFetch(
      "https://apigateway.local/auth/v1/set-password", {
      method: "PATCH",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        old_password: values.oldPassword,
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
        message: "Your password was successfully changed",
        variant: 'success'
      });
    }
    form.reset();
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
      render={({ handleSubmit, submitting, form}) => (
        <form onSubmit={(event)=> handleSubmit(event)?.then(form.reset)}>
          <div>
            <label>Old Password</label>
            <Field name="oldPassword" component="input" type="password" placeholder="Old Password" required />
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

export default ChangePasswordForm;
