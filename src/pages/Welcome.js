import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import './Welcome.css'; // CSSファイルをインポート

function Welcome() {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // 小さい画面(レスポンシブ対応での余白を打ち消す
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                document.body.style.paddingTop = '0';
            }
        };

        // 初期設定
        handleResize();

        // リサイズイベントリスナーを追加
        window.addEventListener('resize', handleResize);

        // クリーンアップ関数でリスナーを削除
        return () => {
            window.removeEventListener('resize', handleResize);
            document.body.style.paddingTop = ''; // 元に戻す
        };
    }, []);

    const handleLogin = async () => {
        try {
            setIsLoading(true);
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
                if (data.needsRegistration) {
                    navigate('/register', { state: { temporaryToken: idToken } });
                } else {
                    sessionStorage.setItem('authToken', idToken);
                    navigate('/dashboard');
                }
            } else {
                console.error("認証エラー:", data.error);
            }
        } catch (error) {
            console.error("ログインエラー:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
            <div className="hero-section">
                <div className="hero-content">
                    <div className="glass-card">
                            <h1 className="title">
                                <div className="title-wrapper">
                                    <span className="main-title">GCS</span>
                                    <span className="subtitle-text">-GithubContributeSystem(GCS)</span>
                                    <span className="subtitle-text">とは~</span>
                                </div>
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