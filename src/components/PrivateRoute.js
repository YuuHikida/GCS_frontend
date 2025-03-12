import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

/**
 * 認証が必要なルートを保護するコンポーネント
 * 
 * 機能:
 * - 認証状態のチェック
 * - 未認証ユーザーをログインページにリダイレクト
 * - ローディング中の表示制御
 * 
 * @param {Object} props.children - 保護するコンポーネント
 */
export function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            if (user) {
                try {
                    await user.getIdToken();
                    setIsAuthenticated(true);
                } catch (error) {
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, [user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/register" />;
    }

    return children;
} 