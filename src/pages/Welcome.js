import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Welcome.css'; // CSSファイルをインポート

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
        <div className="hero-section">
            <div className="hero-content">
                <h1>ようこそ！</h1>
                <p>このウェブサイトは、ユーザーが追加情報を入力するための登録フォームを提供します。</p>
                <p>嗚呼あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ</p>
                <button onClick={handleLogin} className="hero-button">GoogleIDで新規登録/ログイン</button>
            </div>
        </div>
    );
}

export default Welcome; 