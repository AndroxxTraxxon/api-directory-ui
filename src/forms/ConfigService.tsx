import React from 'react';
import { Form, Field } from 'react-final-form';
import { useAuth } from '../context/Auth'; // Ensure this path is correct
import { StoredApiRole, StoredApiService } from '../models/common'; // Ensure this path is correct
import { DateDisplay } from '../common/Date';
import RoleSelector, { NamespaceSelector, ReactSelectAdapter,  } from '../fields/RoleSelector';

type ServiceFormProps = {
  roles: Array<StoredApiRole>,
  serviceData: StoredApiService,
  onSuccess: (service: StoredApiService) => void
}

function ConfigServiceForm({ roles, serviceData, onSuccess }: ServiceFormProps){
  const { authFetch } = useAuth();
  const namespaces = [...new Set(roles.map(role => role.namespace)).values()];
  const assignableRoles = roles.filter(role => role.name !== "__ROLE_NAMESPACE_MEMBER__");
  const roleMap = Object.fromEntries(roles.map(role => [role.id, role]));

  const onSubmit = async (values) => {
    const response = await authFetch(`https://apigateway.local/cfg/v1/api-services/${serviceData.id}`, {
      method: 'PATCH',
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
        environment: values.environment.value,
        // Include other fields as necessary
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
          environment: [{label: serviceData.environment, value: serviceData.environment}],
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
              <label>Environment</label>
              <Field
                name="environment"
                label="Environment"
                component={ReactSelectAdapter}
                options={["PRODUCTION", "STAGING", "CERTIFICATION", "DEVELOPMENT"].map(env => ({label: env, value: env}))}
                searchable
              />
            </div>
            <div>
            <label>Role Namespaces</label>
              <NamespaceSelector name="role_namespaces" namespaces={namespaces} />
            </div>
            <div>
              <label>Roles</label>
              <RoleSelector name="roles" roles={assignableRoles}/>
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
