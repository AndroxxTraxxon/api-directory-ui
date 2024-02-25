import React from 'react';
import { Form, Field } from 'react-final-form';
import { useAuth } from '../context/Auth'; // Ensure this path is correct
import { GatewayUser } from '../models/user';
import { DateDisplay } from '../common/Date';
import { useToast } from '../context/Toast';

type UserFormProps = {
  userData: GatewayUser,
  onSuccess?: (updatedUser: GatewayUser) => void
  onPasswordReset?: () => void
}

type UserFormValues = {
  username: string,
  scopes: string
}

function UserConfigForm({ userData, onSuccess, onPasswordReset }: UserFormProps){
  const { authFetch } = useAuth();
  const { publish: postMessage } = useToast();

  async function handlePasswordReset(){
    const response = await fetch('https://apigateway.local/auth/v1/request-password-reset', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        username: userData.username
      }),
    });

    if(!response.ok){
      console.error(await response.text());
      postMessage({
        message: `Failed to request password reset for user ${userData.username}`,
        title: "Error",
        variant: "error"
      })
      return;
    }

    console.log("Password Reset request submitted");
    postMessage({
      title: `Success`,
      message: `Requested password reset for use ${userData.username}`,
    });
    if (onPasswordReset !== undefined) {
      onPasswordReset();
    }
  }

  async function handleSubmit (values: UserFormValues){
    // Use fetchAuth to submit the form data, including updated scopes
    const response = await authFetch('https://apigateway.local/cfg/v1/users/' + userData.id.id.String, {
      method: 'PATCH',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        username: values.username, // Assuming username can be changed
        scopes: values.scopes.split(',').map(v => v.trim()),
      }),
    });

    if (!response.ok) {
      console.error(await response.text());
      // Handle error
      return;
    }

    // Handle successful update
    console.log('User updated successfully');
    if (onSuccess !== undefined){
      onSuccess(await response.json());
    }
  };

  return (
    <div>
      <h1>User Configuration</h1>
      <Form
        onSubmit={ handleSubmit }
        initialValues={{ username: userData.username, scopes: userData.scopes.join(', ') }}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Username</label>
              <Field name="username" component="input" placeholder="Username" />
            </div>
            <div>
              <label>Scopes (comma-separated)</label>
              <Field name="scopes" component="input" placeholder="Scopes" />
            </div>
            <button type="submit">Save Changes</button>
          </form>
        )}
      />

      <h2>Metadata</h2>
      <div>System ID: {userData.id.id.String}</div>
      <div>Created Date: <DateDisplay value={userData.created_date}/></div>
      <div>Last Modified Date: <DateDisplay value={userData.last_modified_date}/></div>
      <div>Last Login: <DateDisplay value={userData.last_login}/></div>
      <div>Password Reset At: <DateDisplay value={userData.password_reset_at}/></div>
      <button type="button" onClick={handlePasswordReset}> Reset User Password</button>
    </div>
  );
};

export default UserConfigForm;
