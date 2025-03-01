import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { FaHome, FaInfoCircle, FaUser, FaSignOutAlt } from 'react-icons/fa';

function Header({ children }) {
    const { user, loginWithGoogle, logout } = useAuth();
    const navigate = useNavigate();
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
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("ログアウトエラー:", error);
        }
    };

    const handleClick = (index) => {
        setActiveIndex(index);
        switch(index) {
            case 0: // ホーム
                navigate('/dashboard');
                break;
            case 1: // サイトについて
                navigate('/about');
                break;
            case 2: // 個人情報
                navigate('/profile');
                break;
            case 3: // サインアウト
                handleLogout();
                break;
            default:
                break;
        }
    };

    return (
        <>
            <div className="header">
                {[
                    { icon: <FaHome />, label: 'ホーム', path: '/dashboard' },
                    { icon: <FaInfoCircle />, label: 'サイトについて', path: '/about' },
                    { icon: <FaUser />, label: '個人情報', path: '/profile' },
                    { icon: <FaSignOutAlt />, label: 'サインアウト', path: '#' }
                ].map((item, index) => (
                    <a
                        key={index}
                        href={item.path}
                        className={`nav-item ${activeIndex === index ? 'active' : ''}`}
                        onClick={() => handleClick(index)}
                    >
                        {item.icon}
                        <span className="nav-label">{item.label}</span>
                    </a>
                ))}
            </div>
            <div style={{ marginTop: '70px' }}>
                {children}
            </div>
        </>
    );
}

export default Header; 