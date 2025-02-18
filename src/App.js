import './App.css';
import React from 'react';
import { useAuth } from './config/firebase';
import { useNavigate } from 'react-router-dom';

function App() {
  const { user, loading, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await login();
      console.log("ログイン結果:", result);

      if (result.success) {
        if (result.isNewUser) {
          console.log("新規ユーザーです。登録画面へ遷移します。");
          navigate('/register');
        } else {
          console.log("既存ユーザーです。ダッシュボードへ遷移します。");
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error("ログインエラー:", error);
    }
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="App">
      {user ? (
        <div>
          <p>ようこそ、{user.name}さん</p>
          <button onClick={logout}>ログアウト</button>
        </div>
      ) : (
        <div>
          <p>ログインしてください</p>
          <button onClick={handleLogin}>Googleでログイン</button>
        </div>
      )}
    </div>
  );
}

export default App;