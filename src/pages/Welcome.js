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
                <div className="hero-text">
                    <h1>GCS(GithubContributeSystem)とは</h1>
                    <p className="hero-description">
                        自分のGithubのContributeを毎日通知時間に検索し、コミットがない場合、
                        貴方の登録したメールに通知を行います。
                    </p>
                    <p className="hero-sub-description">
                        毎日Gitへのコミットを行い、プログラムへの学習習慣をつけましょう
                    </p>
                    <button onClick={handleLogin} className="hero-button">
                        GoogleIDで新規登録/ログイン
                    </button>
                </div>
                <div className="hero-image">
                    <img src="/githubDisplayIMG.jpg" alt="GitHub Contribution" />
                </div>
            </div>
        </div>
    );
}

export default Welcome; 