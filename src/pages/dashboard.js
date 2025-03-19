import React, { useContext, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { GitHubDataContext } from '../context/GitHubDataContext';

function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { githubData, fetchGitHubData, lastFetchTime } = useContext(GitHubDataContext);

    // 現在の日付を取得 
    const day = new Date();
    const convertDay = day.getFullYear() + '/' + ('0' + (day.getMonth() + 1)).slice(-2) + '/' + ('0' + day.getDate()).slice(-2) + ' ' +  ('0' + day.getHours()).slice(-2) + ':' + ('0' + day.getMinutes()).slice(-2) + ':' + ('0' + day.getSeconds()).slice(-2) + '.' + day.getMilliseconds();
    // console.log("★convertDay", convertDay);

    useEffect(() => {
        if (!lastFetchTime || (new Date() - lastFetchTime) > 300000) { // 5分 = 300000ミリ秒
            fetchGitHubData(user, convertDay);
        }
    }, [user, lastFetchTime, fetchGitHubData]);

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
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: isCommitToday ? '#4CAF50' : '#F44336',
        color: 'white',
        textAlign: 'center',
        marginBottom: '50px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        marginTop: '-10px',
    };

    // 1週間のコミット履歴を表示するスタイル
    const weeklyCommitStyle = {
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '20px',
        marginBottom: '20px',
    };

    // アニメーション用のスタイル
    const animatedStyle = (index) => ({
        width: '40px',
        height: '40px',
        backgroundColor: '#E0E0E0',
        borderRadius: '5px',
        margin: '0 5px',
        animation: weeklyCommitRate[index] ? `lightUp 1s forwards ${index * 0.5}s` : 'none',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    });

    // 日付を計算
    const startOfWeek = new Date(day);
    startOfWeek.setDate(day.getDate() - day.getDay()); // 日曜日を週の始まりとする
    const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
        return `${date.getMonth() + 1}/${date.getDate()}(${dayNames[date.getDay()]})`;
    });

    // 今日の日付と曜日を取得
    const todayDate = `${day.getMonth() + 1}/${day.getDate()}(${['日', '月', '火', '水', '木', '金', '土'][day.getDay()]})`;

    return (
        <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px', backgroundColor: '#f0f0f0', borderRadius: '15px', boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)', maxWidth: '1000px', margin: 'auto' }}>
            <h1 style={{ marginBottom: '30px', fontWeight: 'bold', color: '#333', fontSize: '36px' }}>Dashboard</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ flex: 1, marginRight: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div>
                        <h2 style={{ textAlign: 'center', marginBottom: '50px', fontWeight: 'bold', color: '#333' }}>
                            今日のコミット <span style={{ display: 'block', marginTop: '5px' }}>{todayDate}</span>
                        </h2>
                        <div style={{ ...commitStatusStyle, marginTop: '-10px' }}>
                            <h2>{isCommitToday ? 'あり(がんばったね！😊)' : 'なし(今日はコミットしてみましょう！💪)'}</h2>
                        </div>
                    </div>
                    <div>
                        <h3 style={{ textAlign: 'center', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>1週間のCommit率</h3>
                        <div style={weeklyCommitStyle}>
                            {weeklyCommitRate.map((committed, index) => (
                                <div key={index} style={animatedStyle(index)} />
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '14px', color: '#555' }}>
                            {dates.map((date, index) => (
                                <div key={index} style={{ width: '60px', textAlign: 'center' }}>{date}</div>
                            ))}
                        </div>
                    </div>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>最新リポジトリの使用言語率</h2>
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
        </div>
    );
}

// CSS for animation
const style = document.createElement('style');
style.innerHTML = `
@keyframes lightUp {
    0% { background-color: #E0E0E0; }
    100% { background-color: #4CAF50; }
}
`;
document.head.appendChild(style);

export default Dashboard; 