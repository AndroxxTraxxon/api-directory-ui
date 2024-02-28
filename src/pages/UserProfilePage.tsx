import React from 'react';
import ChangePasswordForm from '../forms/ChangePassword';
import AuthenticatedPage from './AuthenticatedPage';

export default function UserProfilePage() {

  return (
    <AuthenticatedPage>
      <div className='password-reset-page'>
        <h2>Change Your Password</h2>
        <ChangePasswordForm />
      </div>
    </AuthenticatedPage>
  );
}