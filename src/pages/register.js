import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/*概要説明等
目的：
    新規ユーザーが追加情報を入力するための登録フォームを提供
主な機能：
    ユーザー情報入力フォームの表示
    Google認証で取得した基本情報の表示
    GitHubユーザー名などの追加情報の収集
    登録情報のバックエンドへの送信
重要なポイント：
    Googleログインで取得した情報を初期値として表示
    必要な追加情報を収集
    登録完了後にダッシュボードへ遷移
*/

function Register() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        notificationEmail: user?.email || '',
        gitName: '',
        time: ''
    });

    //エラー状態の管理
    const [errors, setErrors] = useState({
        notificationEmail: '',
        gitName: '',
        time: ''
    });

    //デバック
    React.useEffect(() => {
        console.log('Current user:', user);
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    googleId: user.uid,
                    notificationEmail: formData.notificationEmail,
                    gitName: formData.gitName,
                    time: formData.time
                }),
            });

            const data = await response.json();
            
            if (data.success) {
                navigate('/dashboard');
            } else {
                // エラーメッセージを設定
                setErrors(data.errors || {});
            }
        } catch (error) {
            console.error("登録エラー:", error);
        }
    };

    return (
        <div className="register-container">
            <h1>ユーザー登録</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>通知用メールアドレス:</label>
                    <input
                        type="email"
                        value={formData.notificationEmail}
                        onChange={(e) => setFormData({...formData, notificationEmail: e.target.value})}
                        required
                    />
                    {errors.notificationEmail && (
                        <div className="error-message">{errors.notificationEmail}</div>
                    )}
                </div>
                <div>
                    <label>Gitユーザー名:</label>
                    <input
                        type="text"
                        value={formData.gitName}
                        onChange={(e) => setFormData({...formData, gitName: e.target.value})}
                        required
                    />
                    {errors.gitName && (
                        <div className="error-message">{errors.gitName}</div>
                    )}
                </div>
                <div>
                    <label>通知時間:</label>
                    <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        required
                    />
                </div>
                <button type="submit">登録</button>
            </form>
        </div>
    );
}

export default Register;