import React, { useContext, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { GitHubDataContext } from '../context/GitHubDataContext';
import './dashboard.css';

function Dashboard() {
    const { user } = useAuth();
    const { githubData, fetchGitHubData, lastFetchTime } = useContext(GitHubDataContext);

    // 現在の日付を取得
    const day = new Date();
    const convertDay = day.getFullYear() + '/' + ('0' + (day.getMonth() + 1)).slice(-2) + '/' + ('0' + day.getDate()).slice(-2) + ' ' +  ('0' + day.getHours()).slice(-2) + ':' + ('0' + day.getMinutes()).slice(-2) + ':' + ('0' + day.getSeconds()).slice(-2) + '.' + day.getMilliseconds();

    // lastFetchTimeから5分後の時刻を計算
    const lastFetchTimeFromStorage = sessionStorage.getItem('lastFetchTime');
    const nextUpdateTime = lastFetchTimeFromStorage ? new Date(new Date(lastFetchTimeFromStorage).getTime() + 5 * 60000) : null;
    const nextUpdateTimeString = nextUpdateTime ? `${nextUpdateTime.getHours()}:${('0' + nextUpdateTime.getMinutes()).slice(-2)}` : 'N/A';

    useEffect(() => {
        if (!lastFetchTime || (new Date() - lastFetchTime) > 300000) { // 5分 = 300000ミリ秒
            fetchGitHubData(user, convertDay);
        }
    }, [user, lastFetchTime, fetchGitHubData]);

    if (!githubData) {
        return <LoadingScreen />;
    }

    const { isCommitToday, languageUsage, weeklyCommitRate } = githubData;

    /* 円グラフのデータを準備 */

    // 円グラフのデータを準備
    const safeLanguageUsage = languageUsage || {};  // languageUsageがnullなら空オブジェクトにする

    // totalUsageが0の場合の処理（ゼロ除算を防ぐ）
    const totalUsage = Object.values(safeLanguageUsage).reduce((acc, value) => acc + value, 0);

    // totalUsageが0の場合は空の配列を返す
    const pieData = totalUsage > 0 
    ? Object.entries(safeLanguageUsage).map(([name, value]) => ({
        name,
        value,
        percentage: ((value / totalUsage) * 100).toFixed(1) + '%'
    })) 
    : []; // totalUsageが0の場合、空配列を設定

    // 円グラフの色
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    /* 円グラフ要素ここまで*/

    // 今日の日付と曜日を取得
    const todayDate = `${day.getMonth() + 1}/${day.getDate()}(${['日', '月', '火', '水', '木', '金', '土'][day.getDay()]})`;

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

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            <div className="dashboard-content">
                <div className="commit-status">
                    
                    <div className="status">
                        <div className="status-title"><h2>本日:<span>{todayDate}のコミット</span></h2 ></div>
                        <div className="status-text">{isCommitToday ? 'コミット済み(がんばったね！😊)' : 'コミット無し(今日はコミットしてみましょう！💪)'}</div>
                    </div>
                    <h2>今週のコミット</h2>
                    <div className="weekly-commit">
                        
                        {Array.isArray(weeklyCommitRate) && weeklyCommitRate.length > 0 ? (
                            weeklyCommitRate.map((committed, index) => (
                                <div key={index} style={animatedStyle(index)} />
                            ))
                        ) : (
                            <p>No commit data available</p> // データがない場合はメッセージを表示
                        )}
                    </div>
                    
                    <div  style={{ display: 'flex', justifyContent: 'space-around', fontSize: '14px', color: '#555' }}>
      
                        {dates.map((date, index) => (
                            <div key={index} style={{ width: '60px', textAlign: 'center' }}>{date}</div>
                        ))}
                    
                    </div>
                </div>
                <div className="language-usage">
                   <div className="language-usage-title"> <h2>最新リポジトリの使用言語率</h2></div>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={pieData} // safeDataが空配列でも安全
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                            label={false}
                        >
                            {/* pieDataが空でないときにのみmapを実行 */}
                            {Array.isArray(pieData) && pieData.length > 0 && pieData.map((entry, index) => (
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