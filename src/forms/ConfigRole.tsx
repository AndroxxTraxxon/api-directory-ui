import React from 'react';
import { Form, Field } from 'react-final-form';
import { useAuth } from '../context/Auth'; // Ensure this path is correct
import { DateDisplay } from '../common/Date';
import { StoredApiRole } from '../models/common';

type UserFormProps = {
  role: StoredApiRole,
  onSuccess?: (updatedUser: StoredApiRole) => void
}

type UserFormValues = {
  namespace: string,
  name: string
}

function ConfigRoleForm({ role, onSuccess }: UserFormProps){
  const { authFetch } = useAuth();

  async function handleSubmit (values: UserFormValues){
    // Use fetchAuth to submit the form data, including updated scopes
    const response = await authFetch('https://apigateway.local/cfg/v1/api-roles/' + role.id, {
      method: 'PUT',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({...values}),
    });

    if (!response.ok) {
      console.error(await response.text());
      // Handle error
      return;
    }

    // Handle successful update
    console.log(`Role ${role.namespace}::${role.name} renamed to ${values.namespace}::${values.name}`);
    if (onSuccess !== undefined){
      onSuccess(await response.json());
    }
  };

  return (
    <div>
      <h1>Role Configuration</h1>
      <Form
        onSubmit={ handleSubmit }
        initialValues={{ namespace: role.namespace, name: role.name }}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Namespace</label>
              <Field name="namespace" component="input" placeholder="Role/API Namespace" />
            </div>
            <div>
              <label>Name</label>
              <Field name="name" component="input" placeholder="Role Name" />
            </div>
            <button type="submit">Save Changes</button>
          </form>
        )}
      />

      <h2>Metadata</h2>
      <div>System ID: {role.id}</div>
    </div>
  );
};

export default ConfigRoleForm;
