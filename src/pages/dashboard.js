import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("ログアウトエラー:", error);
        }
    };

    return (
        <div className="dashboard-container">
            <h1>ダッシュボード</h1>
            <p>ようこそ {user.email} さん</p>
            <button onClick={handleLogout}>ログアウト</button>
        </div>
    );
}

export default Dashboard; 