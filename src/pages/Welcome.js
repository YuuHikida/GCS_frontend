import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Welcome() {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
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

    return (
        <div className="welcome-container">
            <h1>ようこそ！</h1>
            <p>このウェブサイトは、ユーザーが追加情報を入力するための登録フォームを提供します。</p>
            <button onClick={handleLogin}>Googleでログイン</button>
        </div>
    );
}

export default Welcome; 