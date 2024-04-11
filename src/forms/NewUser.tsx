import React from 'react';
import { Form, Field } from 'react-final-form';
import { useAuth } from '../context/Auth'; // Ensure this path is correct
import { StoredApiRole, GatewayUser } from '../models/common';
import RoleSelector from '../fields/RoleSelector';

type NewUserFormProps = {
  roles: Array<StoredApiRole>,
  onSuccess: (user: GatewayUser) => void; // Adjust the type according to your needs
};

function NewUserForm({ roles, onSuccess }: NewUserFormProps){
  const { authFetch } = useAuth();
  const roleMap = Object.fromEntries(roles.map(role => [role.id, role]));

  const onSubmit = async (values) => {
    const response = await authFetch('https://apigateway.local/cfg/v1/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: values.username,
        roles: values.roles?.map(role=>roleMap[role.value]) || []
      }),
    });

    if (!response.ok) {
      console.error('Failed to create new user');
      // Handle error
      return;
    }

    const newUser = await response.json();
    onSuccess(newUser); // Pass the new user data to the onSuccess handler
    console.log('New user created successfully');
  };

  return (
    <div>
      <h1>New User Configuration</h1>
      <Form
        onSubmit={onSubmit}
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
            <button type="submit">Create User</button>
          </form>
        )}
      />
    </div>
  );
};

export default NewUserForm;
