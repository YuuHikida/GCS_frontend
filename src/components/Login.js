import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const Login = () => {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? (
        <>
          <p>ようこそ、{user.name}さん！</p>
          <button onClick={logout}>ログアウト</button>
        </>
      ) : (
        <button onClick={login}>Googleでログイン</button>
      )}
    </div>
  );
}; 