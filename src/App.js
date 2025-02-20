import './App.css';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';

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
        <Routes>
            {/* デフォルトルートをログインページにリダイレクト */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            {/* 認証が必要なルート */}
            <Route 
                path="/register" 
                element={
                    <PrivateRoute>
                        <Register />
                    </PrivateRoute>
                } 
            />
            <Route 
                path="/dashboard" 
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } 
            />
        </Routes>
    );
}

export default App;