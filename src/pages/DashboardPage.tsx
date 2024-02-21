// Dashboard.js
import React, { useEffect, useState } from 'react';
import AuthenticatedPage from './AuthenticatedPage'; // Ensure this path is correct
import RecordList from '../common/RecordList';
import { useAuth } from '../context/Auth';
import "./DashboardPage.css";

const DashboardPage = () => {

  const { authFetch } = useAuth();
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await authFetch('https://apigateway.local/cfg/v1/users/', {
          method: 'GET',
        });
        if (!response.ok) {
          console.error(response);
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data.map(user => ({ id: user.id, label: user.name }))); // Adjust according to your data structure
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await authFetch('https://apigateway.local/cfg/v1/api_services/', {
          method: 'GET',
        });
        if (!response.ok) {
          console.error(response);
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data.map(service => ({ id: service.id, label: service.name }))); // Adjust according to your data structure
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchUsers();
    fetchServices();
  }, [authFetch]);
  // Adapted placeholder content for Users and Services sections
  
  const handleAddUser = () => {
    console.log("Add User");
    // Add user logic here
  };

  const handleConfigureUser = (userId) => {
    console.log("Configure User:", userId);
    // Configure user logic here
  };

  const handleAddService = () => {
    console.log("Add Service");
    // Add service logic here
  };

  const handleConfigureService = (serviceId) => {
    console.log("Configure Service:", serviceId);
    // Configure service logic here
  };

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
      </div>
    </AuthenticatedPage>
  );
};

export default DashboardPage;