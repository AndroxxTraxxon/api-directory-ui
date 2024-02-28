import React from 'react';
import { Form, Field } from 'react-final-form';
import { useAuth } from '../context/Auth'; // Ensure this path is correct

type NewServiceFormProps = {
  onSuccess: (service: any) => void; // Adjust the type according to your needs
};

function NewServiceForm({ onSuccess }: NewServiceFormProps){
  const { authFetch } = useAuth();

  const onSubmit = async (values) => {
    const response = await authFetch('https://apigateway.local/cfg/v1/api_services/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_name: values.api_name,
        forward_url: values.forward_url,
        active: values.active || false, // Default to false if not specified
        version: values.version,
        gateway_scopes: values.gateway_scopes ? values.gateway_scopes.split(',').map(scope => scope.trim()) : [],
        environment: values.environment,
        contact_info: {
          team: values.team,
          email: values.email
        }
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
              <label>Forward URL</label>
              <Field name="forward_url" component="input" placeholder="Forward URL" />
            </div>
            <div>
              <label>Active</label>
              <Field name="active" component="input" type="checkbox" />
            </div>
            <div>
              <label>Version</label>
              <Field name="version" component="input" placeholder="Version" />
            </div>
            <div>
              <label>Gateway Scopes (comma-separated)</label>
              <Field name="gateway_scopes" component="input" placeholder="Gateway Scopes" />
            </div>
            <div>
              <label>Environment</label>
              <Field name="environment" component="input" placeholder="Gateway Scopes" />
            </div>
            <div>
              <label>Team</label>
              <Field name="team" component="input" placeholder="Gateway Scopes" />
            </div>
            <div>
              <label>Email</label>
              <Field name="email" component="input" placeholder="Gateway Scopes" />
            </div>
            <button type="submit">Create Service</button>
          </form>
        )}
      />
    </div>
  );
};

export default NewServiceForm;
