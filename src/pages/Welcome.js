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
            
            // バックエンドでトークン検証
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/verify-token`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                },
            });

            const data = await response.json();
            
            if (data.success) {
                // トークンをsessionStorageに保存
                sessionStorage.setItem('authToken', idToken);
                
                // 新規ユーザーか既存ユーザーかで遷移先を分岐
                if (data.needsRegistration) {
                    navigate('/register');
                } else {
                    navigate('/dashboard');
                }
            } else {
                console.error("認証エラー:", data.error);
            }
        } catch (error) {
            console.error("ログインエラー:", error);
        }
    };

    return (
        <div className="hero-section">
            <div className="hero-content">
                <div className="glass-card">
                    <h1 className="title">
                        <span>GCS</span>
                        <span className="subtitle">~GithubContributeSystem(GCS)とは~</span>
                    </h1>
                    <div className="description-container">
                        <p className="hero-description">
                            貴方のGithubのContributeを毎日任意の時間に検索し、コミットがない場合、
                            貴方の登録したメールに通知を行います。
                        </p>
                        <p className="hero-sub-description">
                            毎日Gitへのコミットを行い、プログラムへの学習習慣をつけましょう
                        </p>
                    </div>
                    <button onClick={handleLogin} className="login-button">
                        <span className="button-text">GoogleIDで新規登録/ログイン</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Welcome; 