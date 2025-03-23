import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import { FaHome, FaInfoCircle, FaUser, FaSignOutAlt, FaTrophy } from 'react-icons/fa';

function Header({ children }) {
    const { user, loginWithGoogle, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // 現在のパスを取得
    // register.jsが表示されている場合はナビバーを無効化
    const isRegisterPage = location.pathname === '/register';
    const [activeIndex, setActiveIndex] = useState(null);

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

    const handleLogout = async () => {
        try {
            // セッションストレージをクリア
            sessionStorage.removeItem("githubData");
            sessionStorage.removeItem("lastFetchTime");
            sessionStorage.removeItem("authToken");
            await logout();
            navigate('/');
        } catch (error) {
            console.error("ログアウトエラー:", error);
        }
    };

    const handleClick = (index) => {
        setActiveIndex(index);

        // 登録が完了していない場合をチェック
        if (isRegisterPage) {
            alert('登録を完了すると、これらの機能にアクセスできるようになります。\n登録を完了してください。');
            return;
        }

        switch(index) {
            case 0:
                navigate('/dashboard');
                break;
            case 1:
                navigate('/about');
                break;
            case 2:
                navigate('/profile');
                break;
            case 3:
                alert('ランキング機能は現在準備中です！');
                return;
            case 4:
                // console.log("ログアウト処理呼び出し");
                handleLogout();
                return;
            default:
                break;
        }
    };

    return (
        <>
            <header className={`header ${isRegisterPage ? 'header-register' : ''}`}>
                <div className="header">
                    {[
                        { icon: <FaHome />, label: 'ホーム', path: '/dashboard' },
                        { icon: <FaInfoCircle />, label: 'サイトについて', path: '/about' },
                        { icon: <FaUser />, label: 'ユーザー情報編集', path: '/profile' },
                        { icon: <FaTrophy />, label: 'ランキング', path: '/ranking' },
                        { icon: <FaSignOutAlt />, label: 'サインアウト', path: '/' }
                    ].map((item, index) => (
                        <a
                            key={index}
                            href={item.path}
                            className={`nav-item ${activeIndex === index ? 'active' : ''} ${
                                isRegisterPage ? 'disabled' : ''
                            }`}
                            onClick={(e) => {
                                e.preventDefault();
                                if (!isRegisterPage) {
                                    handleClick(index);
                                }
                            }}
                            style={{
                                pointerEvents: isRegisterPage ? 'none' : 'auto',
                                opacity: isRegisterPage ? 0.5 : 1
                            }}
                        >
                            {item.icon}
                            <span className="nav-label">{item.label}</span>
                        </a>
                    ))}
                </div>
            </header>
            <div style={{ marginTop: '70px' }}>
                {children}
            </div>
        </>
    );
}

export default Header; 