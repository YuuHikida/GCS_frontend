import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

function Profile() {
    const { user } = useAuth();

    return (
        <div className="profile-container">
            <h1>プロフィール</h1>
            <div className="profile-info">
                <div className="info-item">
                    <label>メールアドレス:</label>
                    <p>{user?.email}</p>
                </div>
                <div className="info-item">
                    <label>表示名:</label>
                    <p>{user?.displayName || '未設定'}</p>
                </div>
                {user?.photoURL && (
                    <div className="profile-photo">
                        <img src={user.photoURL} alt="プロフィール写真" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile; 