import React from 'react';
import { Form, Field } from 'react-final-form';
import { useAuth } from '../context/Auth'; // Ensure this path is correct
import { GatewayUser, OptionEntry, StoredApiRole } from '../models/common';
import { DateDisplay } from '../common/Date';
import { useToast } from '../context/Toast';
import RoleSelector from '../fields/RoleSelector';

type UserFormProps = {
  roles: Array<StoredApiRole>,
  userData: GatewayUser,
  onSuccess?: (updatedUser: GatewayUser) => void
  onPasswordReset?: () => void
}

type UserFormValues = {
  username: string,
  roles: Array<OptionEntry>
}

function ConfigUserForm({ roles, userData, onSuccess, onPasswordReset }: UserFormProps) {
  const { authFetch } = useAuth();
  const { publish: postMessage } = useToast();

  async function handlePasswordReset() {
    const response = await fetch('https://apigateway.local/auth/v1/request-password-reset', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: userData.username
      }),
    });

    if (!response.ok) {
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

  async function handleSubmit(values: UserFormValues) {
    // Use fetchAuth to submit the form data, including updated scopes
    const roleMap = Object.fromEntries(roles.map(role => [role.id, role]));
    const response = await authFetch('https://apigateway.local/cfg/v1/users/' + userData.id, {
      method: 'PATCH',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: values.username, // Assuming username can be changed
        roles: values.roles.map(role=>roleMap[role.value])
      }),
    });

    if (!response.ok) {
      console.error(await response.text());
      // Handle error
      return;
    }

    // Handle successful update
    console.log('User updated successfully');
    if (onSuccess !== undefined) {
      onSuccess(await response.json());
    }
  };

  return (
    <div>
      <h1>User Configuration</h1>
      <Form
        onSubmit={handleSubmit}
        initialValues={{ 
          username: userData.username, 
          roles: userData.roles.map(
            role => ({ label: `${role.namespace}::${role.name}`, value: role.id })
          )
        }}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Username</label>
              <Field name="username" component="input" placeholder="Username" />
            </div>
            <div>
              <label>Roles</label>
              <RoleSelector name="roles" roles={roles}/>
            </div>
            <button type="submit">Save Changes</button>
          </form>
        )}
      />

      <h2>Metadata</h2>
      <div>System ID: {userData.id}</div>
      <div>Created Date: <DateDisplay value={userData.created_date} /></div>
      <div>Last Modified Date: <DateDisplay value={userData.last_modified_date} /></div>
      <div>Last Login: <DateDisplay value={userData.last_login} /></div>
      <div>Password Reset At: <DateDisplay value={userData.password_reset_at} /></div>
      <button type="button" onClick={handlePasswordReset}> Reset User Password</button>
    </div>
  );
};

export default ConfigUserForm;
