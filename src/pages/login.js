import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const result = await loginWithGoogle();
            console.log("★ログイン結果:", result);
            // バックエンドのAPIを呼び出してユーザー情報を検証
            const idToken = await result.getIdToken();
            const response = await fetch('http://localhost:8080/api/auth/verify-token', {
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

    return (
        <div className="login-container">
            <h1>ログイン</h1>
            <button onClick={handleLogin}>
                Googleでログイン
            </button>
        </div>
    );
}

export default Login; 