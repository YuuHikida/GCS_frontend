import React, { useEffect, useState } from 'react';
import { getAuth } from "firebase/auth";
import './Profile.css';

function Profile() {
    const auth = getAuth();
    const user = auth.currentUser;
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        notificationTime: '',
        gitName: '',
        notificationEmail: ''
    });

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (user) {
                try {
                    const idToken = await user.getIdToken(); // トークンを取得
                    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/info`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${idToken}` // トークンをヘッダーに追加
                        },
                        body: JSON.stringify({ uid: user.uid })
                    });

                    if (!response.ok) {
                        throw new Error('ユーザー情報の取得に失敗しました');
                    }

                    const data = await response.json();
                    setUserInfo(data);
                    setFormData({
                        notificationTime: data.notificationTime || '',
                        gitName: data.gitName || '',
                        notificationEmail: data.notificationEmail || ''
                    });
                } catch (error) {
                    console.error('エラー:', error);
                    setError(error.message);
                }
            }
        };

        fetchUserInfo();
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const idToken = await user.getIdToken();
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({ uid: user.uid, ...formData })
            });

            if (!response.ok) {
                throw new Error('ユーザー情報の更新に失敗しました');
            }

            const data = await response.json();
            setUserInfo(data);
            alert('ユーザー情報が更新されました');
        } catch (error) {
            console.error('エラー:', error);
            setError(error.message);
        }
    };

    return (
        <div className="profile-container">
            <h1>プロフィール</h1>
            {error && <p className="error">{error}</p>}
            {userInfo ? (
                <form onSubmit={handleSubmit}>
                    <div className="info-item">
                        <label>通知メール:</label>
                        <input
                            type="email"
                            name="notificationEmail"
                            value={formData.notificationEmail}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="info-item">
                        <label>GitHubユーザー名:</label>
                        <input
                            type="text"
                            name="gitName"
                            value={formData.gitName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="info-item">
                        <label>通知時間:</label>
                        <input
                            type="time"
                            name="notificationTime"
                            value={formData.notificationTime}
                            onChange={handleChange}
                        />
                    </div>

                    {userInfo.photoURL && (
                        <div className="profile-photo">
                            <img src={userInfo.photoURL} alt="プロフィール写真" />
                        </div>
                    )}
                    <button type="submit">更新</button>
                </form>
            ) : (
                <p>ユーザー情報を読み込んでいます...</p>
            )}
        </div>
    );
}

export default Profile; 