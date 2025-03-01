import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import Header from './components/Header';
import Welcome from './pages/Welcome';
import About from './pages/About';
import Profile from './pages/Profile';

/**
 * アプリケーションのメインコンポーネント
 * ルーティング設定を管理し、各ページへの遷移を制御
 * 
 * ルーティング構成:
 * / -> ウェルカムページ（未認証可）
 * /register -> 新規登録ページ（未認証可）
 * /login -> ログインページ（PrivateRoute保護）
 * /dashboard -> ダッシュボード（PrivateRoute保護）
 * /about -> サイト説明（PrivateRoute保護）
 * /profile -> プロフィールページ（PrivateRoute保護）
 */

function App() {
    return (
        <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/register" element={<Header disableAuthButtons={true}><Register /></Header>} />
            <Route path="/dashboard" element={
                <PrivateRoute>
                    <Header><Dashboard /></Header>
                </PrivateRoute>
            } />
            <Route path="/about" element={
                <PrivateRoute>
                    <Header><About /></Header>
                </PrivateRoute>
            } />
            <Route path="/profile" element={
                <PrivateRoute>
                    <Header><Profile /></Header>
                </PrivateRoute>
            } />
        </Routes>
    );
}

export default App;