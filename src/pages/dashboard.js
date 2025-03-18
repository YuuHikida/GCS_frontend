import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    //　現在の日付を取得
    const day = new Date();
    const convertDay = day.getFullYear() + '/' + ('0' + (day.getMonth() + 1)).slice(-2) + '/' +('0' + day.getDate()).slice(-2) + ' ' +  ('0' + day.getHours()).slice(-2) + ':' + ('0' + day.getMinutes()).slice(-2) + ':' + ('0' + day.getSeconds()).slice(-2) + '.' + day.getMilliseconds();
    console.log("★convertDay", convertDay);

    useEffect(() => {
        const fetchGitHubData = async () => {
            try {
                const idToken = await user.getIdToken();
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/github/userDate?clientTimeStamp=${encodeURIComponent(convertDay)}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${idToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log('GitHub Data:', data);
            } catch (error) {
                console.error('Error fetching GitHub data:', error);
            }
        };

        fetchGitHubData();
    }, []);

    return (
        <div className="dashboard-container">
            <h1>ダッシュボード</h1>
            <p>ようこそ {user.email} さん</p>
            <LoadingScreen />
        </div>
    );
}

export default Dashboard; 