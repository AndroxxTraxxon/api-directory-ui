import React from 'react';
import { Form, Field } from 'react-final-form';
import { useAuth } from '../context/Auth'; // Ensure this path is correct
import { ApiRole, ApiService, OptionEntry, StoredApiRole, StoredApiService } from '../models/common';
import RoleSelector, { NamespaceSelector } from '../fields/RoleSelector';

type NewServiceFormProps = {
  roles: Array<StoredApiRole>,
  onSuccess: (service: StoredApiService) => void; // Adjust the type according to your needs
};
interface NewServiceFormValues {
  api_name: string,
  forward_url: string,
  active: string,
  version: string,
  roles: Array<OptionEntry>,
  role_namespaces: Array<OptionEntry>,
  environment: string,
}
function NewServiceForm({ roles, onSuccess }: NewServiceFormProps) {
  const { authFetch } = useAuth();
  const namespaces = [...new Set(roles.map(role => role.namespace)).values()];
  const  = []
  const roleMap = Object.fromEntries(roles.map(role => [role.id, role]));

  const onSubmit = async (values: NewServiceFormValues) => {
    const response = await authFetch('https://apigateway.local/cfg/v1/api-services/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_name: values.api_name,
        forward_url: values.forward_url,
        active: values.active || false, // Default to false if not specified
        version: values.version,
        roles: values.roles.map(option => roleMap[option.value]),
        role_namespaces: values.role_namespaces.map(option => option.value),
        environment: values.environment,
        // Include other fields as necessary
      }),
    });

    if (!response.ok) {
      console.error('Failed to create new service');
      // Handle error
      return;
    }

    const newService = await response.json();
    onSuccess(newService); // Pass the new service data to the onSuccess handler
    console.log('New service created successfully');
  };

  return (
    <div>
      <h1>New Service Configuration</h1>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div>
              <label>API Name</label>
              <Field name="api_name" component="input" placeholder="API Name" />
            </div>
            <div>
              <label>Version</label>
              <Field name="version" component="input" placeholder="Version" />
            </div>
            <div>
              <label>Forward URL</label>
              <Field name="forward_url" component="input" placeholder="Forward URL" />
            </div>
            <div>
              <label>Active</label>
              <Field name="active" component="input" type="checkbox" />
            </div>
            <div>
              <label>Environment</label>
              <Field name="environment" component="input" placeholder="Environment" />
            </div>
            <hr></hr>
            <div>
              <label>Role Namespaces</label>
              <NamespaceSelector name="role_namespaces" namespaces={namespaces} />
            </div>
            <div>
              <label>Roles</label>
              <RoleSelector name="roles" roles={roles} />
            </div>


            <button type="submit">Create Service</button>
          </form>
        )}
      />
    </div>
  );
};

export default NewServiceForm;
