import React from 'react';
import { Form, Field } from 'react-final-form';
import { useAuth } from '../context/Auth'; // Ensure this path is correct
import { ApiService } from '../models/service'; // Ensure this path is correct
import { DateDisplay } from '../common/Date';

type ServiceFormProps = {
  serviceData: ApiService,
  onSuccess: (service: ApiService) => void
}

function ServiceConfigForm({ serviceData, onSuccess }: ServiceFormProps){
  const { authFetch } = useAuth();

  const onSubmit = async (values) => {
    const response = await authFetch(`https://apigateway.local/cfg/v1/api_services/${serviceData.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_name: values.api_name,
        forward_url: values.forward_url,
        active: values.active,
        version: values.version,
        gateway_scopes: values.gateway_scopes.split(',').map(scope => scope.trim()),
        environment: serviceData.environment,
        contact_info: {
          team: values.team,
          email: values.email
        }
        // Add other fields here as necessary
      }),
    });

    if (!response.ok) {
      console.error('Failed to update service');
      // Handle error
      return;
    }

    const updatedService = await response.json();
    onSuccess(updatedService); // Assuming onSuccess needs the updated service data
    console.log('Service updated successfully');
  };

  return (
    <div>
      <h1>Service Configuration</h1>
      <Form
        onSubmit={onSubmit}
        initialValues={{
          api_name: serviceData.api_name,
          forward_url: serviceData.forward_url,
          active: serviceData.active,
          version: serviceData.version,
          gateway_scopes: serviceData.gateway_scopes.join(', '),
          environment: serviceData.environment,
          team: serviceData.contact_info.team,
          email: serviceData.contact_info.email
        }}
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
            <button type="submit">Save Changes</button>
          </form>
        )}
      />

      {/* Display non-editable metadata */}
      <h2>Metadata</h2>
      <div>System ID: {serviceData.id.id.String}</div>
      <div>Created Date: <DateDisplay value={serviceData.created_date}/></div>
      <div>Last Modified Date: <DateDisplay value={serviceData.last_modified_date}/></div>
      {/* Display other metadata fields */}
    </div>
  );
};

export default ServiceConfigForm;
