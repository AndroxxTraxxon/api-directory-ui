// AuthenticatedPage.js
import React from 'react';
import { RequireAuth, useAuth } from '../context/Auth'; // Adjust the import path as necessary
import "./AuthenticatedPage.css";
import { NavLink } from 'react-router-dom';

function AuthenticatedPage({ children }) {
  const { claims } = useAuth();
  const currentYear = new Date().getFullYear(); // Get the current year for the copyright notice

  return (
    <RequireAuth>
      <div>
        <header>
          <nav>
            <NavLink
              to="/app" 
              className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "active" : ""
            }>Home</NavLink>
            <div>
              {/* Assuming you might want to add more navigation items here */}
              Logged in as: <strong>{claims?.sub}</strong>
            </div>
            <NavLink to="/user-profile" className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "active" : ""
            }>Profile</NavLink>
            <NavLink to="/logout" className = {({isPending}) => isPending ? "pending" : ""} >
              Logout
            </NavLink>
          </nav>
        </header>
        <main>{children}</main>
        <footer>
          <p>© {currentYear} David Culbreth. All rights reserved.</p>
        </footer>
      </div>
    </RequireAuth>
  );
};

export default AuthenticatedPage;
