import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Header({ disableAuthButtons }) {
    const { user, loginWithGoogle, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (disableAuthButtons) return;
        try {
            const result = await loginWithGoogle();
            const idToken = await result.getIdToken();
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/verify-token`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                },
            });

            const data = await response.json();
            if (data.success) {
                if (data.isNewUser) {
                    navigate('/register');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (error) {
            console.error("ログインエラー:", error);
        }
    };

    const handleLogout = async () => {
        if (disableAuthButtons) return;
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("ログアウトエラー:", error);
        }
    };

    return (
        <header className="header">
            <h1>アプリ名</h1>
            {!disableAuthButtons && (
                user ? (
                    <button onClick={handleLogout}>ログアウト</button>
                ) : (
                    <button onClick={handleLogin}>Googleでログイン</button>
                )
            )}
        </header>
    );
}

export default Header; 