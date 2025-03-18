import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [githubData, setGitHubData] = useState(null);

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
                setGitHubData(data);
            } catch (error) {
                console.error('Error fetching GitHub data:', error);
            }
        };

        fetchGitHubData();
    }, []);

    if (!githubData) {
        return <LoadingScreen />;
    }

    const { isCommitToday, languageUsage, weeklyCommitRate } = githubData;

    // 円グラフのデータを準備
    const totalUsage = Object.values(languageUsage).reduce((acc, value) => acc + value, 0);
    const pieData = Object.entries(languageUsage).map(([name, value]) => ({
        name,
        value,
        percentage: ((value / totalUsage) * 100).toFixed(1) + '%'
    }));

    // 円グラフの色
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    // 今日のコミットの有無を表示するスタイル
    const commitStatusStyle = {
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: isCommitToday ? '#4CAF50' : '#F44336',
        color: 'white',
        textAlign: 'center',
        marginBottom: '20px',
    };

    // 1週間のコミット履歴を表示するスタイル
    const weeklyCommitStyle = {
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '20px',
    };

    return (
        <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
            <div style={{ flex: 1, marginRight: '20px' }}>
                <div style={commitStatusStyle}>
                    <h2>今日のコミット: {isCommitToday ? 'あり' : 'なし'}</h2>
                </div>
                <div style={weeklyCommitStyle}>
                    {weeklyCommitRate.map((committed, index) => (
                        <div
                            key={index}
                            style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: committed ? '#4CAF50' : '#E0E0E0',
                                borderRadius: '3px',
                            }}
                        />
                    ))}
                </div>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
                <h2 style={{ marginBottom: '20px' }}>最新リポジトリの使用言語率</h2>
                <PieChart width={400} height={400}>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        label={false}
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${((value / totalUsage) * 100).toFixed(1)}%`} />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </div>
        </div>
    );
}

export default Dashboard; 