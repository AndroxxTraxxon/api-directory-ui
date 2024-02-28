// Dashboard.js
import React, { useEffect, useState } from 'react';
import AuthenticatedPage from './AuthenticatedPage'; // Ensure this path is correct
import RecordList, { ListItem } from '../common/RecordList';
import { useAuth } from '../context/Auth';
import UserConfigForm from '../forms/UserConfig';
import ServiceConfigForm from '../forms/ServiceConfig';
import "./DashboardPage.css";
import Modal from '../common/Modal';
import { GatewayUser } from '../models/user';
import { ApiService } from '../models/service';
import NewServiceForm from '../forms/NewService';
import NewUserForm from '../forms/NewUser';
import { useToast } from '../context/Toast';

const CMP_UNMOUNT_ERR = "DashboardPage::Component_Unmounted"

function DashboardPage(){

  const { authFetch } = useAuth();
  const [users, setUsers] = useState<Array<ListItem<GatewayUser>>>([]);
  const [services, setServices] = useState<Array<ListItem<ApiService>>>([]);
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
      setUsers(data.map(user => ({ id: user.id.id.String, label: user.username, record: user }))); // Adjust according to your data structure
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
      const response = await authFetch('https://apigateway.local/cfg/v1/api_services/', {
        method: 'GET',
        signal
      });
      if (!response.ok) {
        console.error(response);
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data.map(service => ({ id: service.id.id.String, label: `${service.api_name}/${service.version}`, record: service }))); // Adjust according to your data structure
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

  useEffect(function loadUserData(){
    const abortController: AbortController = new AbortController();
    fetchUsers(abortController.signal);
    fetchServices(abortController.signal);
    return function abortLoadUserData(){abortController.abort(CMP_UNMOUNT_ERR)};
  }, [authFetch]);
  // Adapted placeholder content for Users and Services sections

  function handleAddUser(){
    function handleUserAdded(user: GatewayUser) {
      const newUsers = [...users, {
        id: user.id.id.String,
        label: user.username,
        record: user,
      }]; 
      setUsers(newUsers);
      setModalOpen(false);
    }
    setModalContent(<NewUserForm onSuccess={handleUserAdded} />);
    setModalOpen(true);
  };

  // Handlers for opening the modal with the specific form
  function handleConfigureUser(usersIndex){
    function handleUserUpdated(updatedUser: GatewayUser) {
      const newUsers = [...users];
      newUsers[usersIndex] = {
        id: updatedUser.id.id.String,
        label: updatedUser.username,
        record: updatedUser,
      };
      setUsers(newUsers);
      setModalOpen(false);
    }
    setModalContent(<UserConfigForm userData={users[usersIndex].record} onSuccess={handleUserUpdated} />);
    setModalOpen(true);
  }


  function handleAddService(){
    function handleServiceAdded(service: ApiService) {
      const newServices = [...services, {
        id: service.id.id.String,
        label: service.api_name + "/" + service.version,
        record: service,
      }];
      setServices(newServices);
      setModalOpen(false);
    }
    setModalContent(<NewServiceForm onSuccess={handleServiceAdded} />);
    setModalOpen(true);
  };



  function handleConfigureService (index: number) {

    function handleServiceUpdated(service: ApiService) {
      const newServices = [...services];
      newServices[index] = {
        id: service.id.id.String,
        label: service.api_name + "/" + service.version,
        record: service,
      };
      setServices(newServices);
      setModalOpen(false);
    }
    setModalContent(<ServiceConfigForm serviceData={services[index].record} onSuccess={handleServiceUpdated} />);
    setModalOpen(true);
  };

  function handleCloseModal(){
    setModalOpen(false);
  }

  return (
    <AuthenticatedPage>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>API Gateway Configuration</p>
        </div>

        <div className="record-list-container"> {/* Flex container */}
          <RecordList
            title="Users"
            items={users}
            addButtonLabel="Add User"
            onAdd={handleAddUser}
            configButtonLabel="Configure"
            onConfigure={handleConfigureUser}
          />

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
    </AuthenticatedPage>
  );
};

export default DashboardPage;