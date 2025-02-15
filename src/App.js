import './App.css';
import React from 'react';
import { useAuth } from './config/firebase';

function App() {
  const { user, loading, login, logout } = useAuth();

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
          <button onClick={login}>Googleでログイン</button>
        </div>
      )}
    </div>
  );
}

export default App;