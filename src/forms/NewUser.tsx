import React from 'react';
import { Form, Field } from 'react-final-form';
import { useAuth } from '../context/Auth'; // Ensure this path is correct
import { GatewayUser } from '../models/user';

type NewUserFormProps = {
  onSuccess: (user: GatewayUser) => void; // Adjust the type according to your needs
};

function NewUserForm({ onSuccess }: NewUserFormProps){
  const { authFetch } = useAuth();

  const onSubmit = async (values) => {
    const response = await authFetch('https://apigateway.local/cfg/v1/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: values.username,
        scopes: values.scopes ? values.scopes.split(',').map(scope => scope.trim()) : [],
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
              <label>Scopes (comma-separated)</label>
              <Field name="scopes" component="input" placeholder="Scopes" />
            </div>
            <button type="submit">Create User</button>
          </form>
        )}
      />
    </div>
  );
};

export default NewUserForm;
