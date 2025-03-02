import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();



    return (
        <div className="dashboard-container">
            <h1>ダッシュボード</h1>
            <p>ようこそ {user.email} さん</p>

        </div>
    );
}

export default Dashboard; 