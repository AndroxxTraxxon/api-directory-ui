import React from 'react';
import { Form, Field } from 'react-final-form';
import { useAuth } from '../context/Auth'; // Ensure this path is correct
import { StoredApiRole, StoredApiService } from '../models/common'; // Ensure this path is correct
import { DateDisplay } from '../common/Date';
import RoleSelector from '../fields/RoleSelector';

type ServiceFormProps = {
  roles: Array<StoredApiRole>,
  serviceData: StoredApiService,
  onSuccess: (service: StoredApiService) => void
}

function ConfigServiceForm({ roles, serviceData, onSuccess }: ServiceFormProps){
  const { authFetch } = useAuth();

  const onSubmit = async (values) => {
    const response = await authFetch(`https://apigateway.local/cfg/v1/api-services/${serviceData.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({...values}),
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
          environment: serviceData.environment,
          roles: serviceData.roles.map(
            role => ({ label: `${role.namespace}::${role.name}`, value: role.id })
          ),
          role_namespaces: serviceData.role_namespaces.map(ns => ({ label: ns, value: ns}))
        }}
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
              <label>Role Namespaces</label>
              <Field name="role_namespaces" component="input" placeholder="Gateway Scopes" />
            </div>
            <div>
              <label>Roles</label>
              <RoleSelector name="roles" roles={roles}/>
            </div>
            <div>
              <label>Environment</label>
              <Field name="environment" component="input" placeholder="Environment" />
            </div>
            <button type="submit">Save Changes</button>
          </form>
        )}
      />

      {/* Display non-editable metadata */}
      <h2>Metadata</h2>
      <div>System ID: {serviceData.id}</div>
      <div>Created Date: <DateDisplay value={serviceData.created_date}/></div>
      <div>Last Modified Date: <DateDisplay value={serviceData.last_modified_date}/></div>
      {/* Display other metadata fields */}
    </div>
  );
};

export default ConfigServiceForm;
