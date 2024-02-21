// AuthenticatedPage.js
import React from 'react';
import { RequireAuth, useAuth } from '../context/Auth'; // Adjust the import path as necessary
import "./AuthenticatedPage.css";

const AuthenticatedPage = ({ children }) => {
  const { logout, claims } = useAuth();
  const currentYear = new Date().getFullYear(); // Get the current year for the copyright notice

  return (
    <RequireAuth>
      <div>
        <header>
          <nav>
            <div>
              {/* Assuming you might want to add more navigation items here */}
              Logged in as: <strong>{claims?.sub}</strong>
            </div>
            <button onClick={logout}>Logout</button>
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
