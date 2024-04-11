import React from 'react';
import { Form, Field } from 'react-final-form';
import { useAuth } from '../context/Auth'; // Ensure this path is correct
import { StoredApiRole } from '../models/common';

type NewRoleFormProps = {
  onSuccess: (user: StoredApiRole) => void; // Adjust the type according to your needs
};

function NewRoleForm({ onSuccess }: NewRoleFormProps){
  const { authFetch } = useAuth();

  const onSubmit = async (values) => {
    const response = await authFetch('https://apigateway.local/cfg/v1/api-roles/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      console.error('Failed to create new role');
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
              <label>Namespace</label>
              <Field name="namespace" component="input" placeholder="Namespace" />
            </div>
            <div>
              <label>Name</label>
              <Field name="name" component="input" placeholder="Role Name" />
            </div>
            <button type="submit">Create Role</button>
          </form>
        )}
      />
    </div>
  );
};

export default NewRoleForm;
