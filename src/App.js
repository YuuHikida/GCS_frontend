import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import Header from './components/Header';
import Welcome from './pages/Welcome';

/**
 * アプリケーションのメインコンポーネント
 * ルーティング設定を管理し、各ページへの遷移を制御
 * 
 * ルーティング構成:
 * / -> ログインページにリダイレクト
 * /login -> 未認証ユーザー用のログインページ
 * /register -> 認証済みユーザーの登録ページ（PrivateRoute保護）
 * /dashboard -> 認証済みユーザーのダッシュボード（PrivateRoute保護）
 */
function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/register" element={<><Header disableAuthButtons={true} /><Register /></>} />
                <Route path="/dashboard" element={<><Header /><Dashboard /></>} />
                <Route path="/login" element={<><Header /><Login /></>} />
            </Routes>
        </>
    );
}

export default App;