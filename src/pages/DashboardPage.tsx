// Dashboard.js
import React, { useEffect, useState } from 'react';
import AuthenticatedPage from './AuthenticatedPage'; // Ensure this path is correct
import RecordList, { ListItem } from '../common/RecordList';
import { useAuth, GATEWAY_ADMIN_ROLE as GATEWAY_ADMIN_ROLE } from '../context/Auth';
import ConfigUserForm from '../forms/ConfigUser';
import ConfigServiceForm from '../forms/ConfigService';
import "./DashboardPage.css";
import Modal from '../common/Modal';
import { StoredApiService, StoredApiRole, GatewayUser } from '../models/common';
import NewServiceForm from '../forms/NewService';
import NewUserForm from '../forms/NewUser';
import { useToast } from '../context/Toast';
import NewRoleForm from '../forms/NewRole';
import ConfigRoleForm from '../forms/ConfigRole';

const CMP_UNMOUNT_ERR = "DashboardPage::Component_Unmounted"

function DashboardPage() {

  const { authFetch, claims } = useAuth();
  const [users, setUsers] = useState<Array<ListItem<GatewayUser>>>([]);
  const [roles, setRoles] = useState<Array<ListItem<StoredApiRole>>>([]);
  const [services, setServices] = useState<Array<ListItem<StoredApiService>>>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<any>(null);
  const { publish } = useToast();

  async function fetchUsers(signal: AbortSignal) {
    try {
      const response = await authFetch('https://apigateway.local/cfg/v1/users/', {
        method: 'GET',
        signal
      });
      if (!response.ok) {
        console.error(response);
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data.map(user => ({ id: user.id, label: user.username, record: user }))); // Adjust according to your data structure
    } catch (error) {
      if (error !== CMP_UNMOUNT_ERR && error.name !== "AbortError") {
        publish({
          title: "Error",
          message: error.toString(),
          variant: 'error'
        });
      }
    }
  };

  async function fetchServices(signal: AbortSignal) {
    try {
      const response = await authFetch('https://apigateway.local/cfg/v1/api-services/', {
        method: 'GET',
        signal
      });
      if (!response.ok) {
        console.error(response);
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data.map(service => ({ id: service.id, label: `${service.api_name}/${service.version}`, record: service }))); // Adjust according to your data structure
    } catch (error) {
      if (error !== CMP_UNMOUNT_ERR && error.name !== "AbortError") {
        publish({
          title: "Error",
          message: error.toString(),
          variant: 'error'
        });
      }
    }
  };

  async function fetchRoles(signal: AbortSignal) {
    try {
      const response = await authFetch('https://apigateway.local/cfg/v1/api-roles/', {
        method: "GET",
        signal
      });
      if (!response.ok) {
        console.error(response);
        throw new Error('Failed to fetch roles');
      }
      const data = await response.json();
      setRoles(data.map(role => ({ id: role.id, label: `${role.namespace}::${role.name}`, record: role }))); // Adjust according to your data structure
    } catch (error) {
      if (error !== CMP_UNMOUNT_ERR && error.name !== "AbortError") {
        publish({
          title: "Error",
          message: error.toString(),
          variant: 'error',
        })
      }
    }
  }

  useEffect(function loadUserData() {
    const abortController: AbortController = new AbortController();
    fetchUsers(abortController.signal);
    fetchServices(abortController.signal);
    fetchRoles(abortController.signal);
    return function abortLoadUserData() { abortController.abort(CMP_UNMOUNT_ERR) };
  }, [authFetch]);
  // Adapted placeholder content for Users and Services sections

  function handleAddUser() {
    function handleUserAdded(user: GatewayUser) {
      const newUsers = [...users, {
        id: user.id,
        label: user.username,
        record: user,
      }];
      setUsers(newUsers);
      setModalOpen(false);
      publish({
        title: "Success",
        message: "Registered User: " + user.username,
        variant: 'success'
      });
    }
    setModalContent(<NewUserForm roles={roles.filter(role => role.record.name != "__ROLE_NAMESPACE_MEMBER__").map(item => item.record)} onSuccess={handleUserAdded} />);
    setModalOpen(true);

  };

  // Handlers for opening the modal with the specific form
  function handleConfigureUser(usersIndex) {
    function handleUserUpdated(updatedUser: GatewayUser) {
      const newUsers = [...users];
      newUsers[usersIndex] = {
        id: updatedUser.id,
        label: updatedUser.username,
        record: updatedUser,
      };
      setUsers(newUsers);
      setModalOpen(false);
      publish({
        title: "Success",
        message: "Updated User: " + updatedUser.username,
        variant: 'success'
      });
    }
    setModalContent(<ConfigUserForm userData={users[usersIndex].record} roles={roles.filter(role => role.record.name != "__ROLE_NAMESPACE_MEMBER__").map(item => item.record)} onSuccess={handleUserUpdated} />);
    setModalOpen(true);

  }


  function handleAddService() {
    function handleServiceAdded(service: StoredApiService) {
      const serviceLabel = service.api_name + "/" + service.version;
      const newServices = [...services, {
        id: service.id,
        label: serviceLabel,
        record: service,
      }];
      setServices(newServices);
      setModalOpen(false);
      publish({
        title: "Success",
        message: "Created Service: " + serviceLabel,
        variant: 'success'
      });
    }
    setModalContent(<NewServiceForm roles={roles.map(item => item.record)} onSuccess={handleServiceAdded} />);
    setModalOpen(true);
  };

  function handleConfigureService(index: number) {
    function handleServiceUpdated(service: StoredApiService) {
      const serviceLabel = service.api_name + "/" + service.version;
      const newServices = [...services];
      newServices[index] = {
        id: service.id,
        label: service.api_name + "/" + service.version,
        record: service,
      };
      setServices(newServices);
      setModalOpen(false);
      publish({
        title: "Success",
        message: "Updated Service: " + serviceLabel,
        variant: 'success'
      });
    }
    setModalContent(<ConfigServiceForm serviceData={services[index].record} roles={roles.map(item => item.record)} onSuccess={handleServiceUpdated} />);
    setModalOpen(true);
  };

  function handleAddRole() {
    function handleRoleAdded(role: StoredApiRole) {
      const roleLabel = role.namespace + "::" + role.name
      const newRoles = [...roles, {
        id: role.id,
        label: roleLabel,
        record: role
      }];

      setRoles(newRoles);
      setModalOpen(false);
      publish({
        title: "Success",
        message: "Created Role " + roleLabel,
        variant: 'success'
      });

    }

    setModalContent(<NewRoleForm onSuccess={handleRoleAdded} />);
    setModalOpen(true);
  }

  function handleConfigureRole(index: number) {
    function handleRoleUpdated(role: StoredApiRole) {
      const roleLabel = role.namespace + "::" + role.name
      const newRoles = [...roles];
      newRoles[index] = {
        id: role.id,
        label: roleLabel,
        record: role
      };

      setRoles(newRoles);
      setModalOpen(false);
      publish({
        title: "Success",
        message: "Updated Role " + roleLabel,
        variant: 'success'
      });

    }

    setModalContent(<ConfigRoleForm role={roles[index].record} onSuccess={handleRoleUpdated} />);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>API Gateway Configuration</p>
      </div>

      <div className="record-list-container">
        <RecordList
          title="Users"
          items={users}
          addButtonLabel="Add User"
          onAdd={handleAddUser}
          configButtonLabel="Configure"
          onConfigure={handleConfigureUser}
        />

        <RecordList
          title="Roles"
          items={roles.filter(role => role.record.name != "__ROLE_NAMESPACE_MEMBER__")}
          addButtonLabel="Add Role"
          onAdd={handleAddRole}
          configButtonLabel="Configure"
          onConfigure={handleConfigureRole} />

        <RecordList
          title="Services"
          items={services}
          addButtonLabel="Add Service"
          onAdd={handleAddService}
          configButtonLabel="Configure"
          onConfigure={handleConfigureService}
        />
      </div>
      <Modal isOpen={modalOpen} onClose={handleCloseModal}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default () => <AuthenticatedPage><DashboardPage /></AuthenticatedPage>;