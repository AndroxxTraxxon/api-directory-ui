// NotFoundPage.js
import React from 'react';
import AuthenticatedPage from './AuthenticatedPage'; // Adjust the import path as necessary

const NotFoundPage = () => {
  return (
    <AuthenticatedPage>
      <div>
        <h1>404 Not Found</h1>
        <p>The page you are looking for does not exist or you do not have access to it.</p>
      </div>
    </AuthenticatedPage>
  );
};

export default NotFoundPage;