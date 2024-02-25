import React from 'react';
import ResetPasswordForm from '../forms/ResetPassword';
import { useParams } from 'react-router-dom';
import RequestPasswordResetForm from '../forms/RequestPasswordReset';

export default function ResetPasswordPage() {
    const { token } = useParams();

    return (
        <div className='password-reset-page'>
            <h2>Reset Your Password</h2>
            <h3>{token || "No Token found."}</h3>
            {(token && <ResetPasswordForm token={token}/>) || <RequestPasswordResetForm />}
        </div>
    );
}