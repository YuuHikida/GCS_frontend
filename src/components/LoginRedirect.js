import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SuccessPopup from './SuccessPopup'; // SuccessPopupをインポート

function LoginRedirect({ user, message = 'ユーザーがログインしていません。再ログインしてください。', redirectPath = '/welcome' }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            toast.error(message);
            setTimeout(() => {
                navigate(redirectPath);
            }, 2000);
        }
    }, [user, message, navigate, redirectPath]);

    return (
        <SuccessPopup isOpen={!user} onClose={() => {}} message={message} />
    );
}

export default LoginRedirect;