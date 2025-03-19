import './App.css';
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { GitHubDataProvider } from './context/GitHubDataContext';

import Register from './pages/register';
import Dashboard from './pages/dashboard';
import Header from './components/Header';
import Welcome from './pages/Welcome';
import About from './pages/About';
import Profile from './pages/Profile';
import Demo from './pages/test';

/**
 * 認証が必要なルートを保護するコンポーネント
 * user が null の場合は Welcome ページにリダイレクト
 */
const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    // 未認証ユーザーは Welcome ページへリダイレクト
    if (!user) {
        return <Navigate to="/" />;
    }

    return children;
};

/**
 * アプリケーションのメインコンポーネント
 * ルーティング構成:
 * / -> Welcome（未認証可）
 * 以下は全て認証必須:
 * /register -> 新規ユーザー登録
 * /dashboard -> メインダッシュボード
 * /about -> サービス説明
 * /profile -> ユーザープロフィール
 */
function App() {
    return (
        <GitHubDataProvider>
            <Routes>
                {/* 未認証でもアクセス可能なルート */}
                <Route path="/" element={<Welcome />} />

                {/* === 以下、全て認証必須のルート === */}
                <Route path="/register" element={
                    <PrivateRoute>
                        <Header disableAuthButtons={true}>
                            <Register />
                        </Header>
                    </PrivateRoute>
                } />
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <Header>
                            <Dashboard />
                        </Header>
                    </PrivateRoute>
                } />
                <Route path="/about" element={
                    <PrivateRoute>
                        <Header>
                            <About />
                        </Header>
                    </PrivateRoute>
                } />
                <Route path="/profile" element={
                    <PrivateRoute>
                        <Header>
                            <Profile />
                        </Header>
                    </PrivateRoute>
                } />

                {/* 不明なパスは Welcome ページにリダイレクト */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </GitHubDataProvider>
    );
}

export default App;