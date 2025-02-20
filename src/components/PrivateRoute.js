import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

    if (loading) {
        return <div>Loading...</div>;
    }

    // 未認証ユーザーはログインページへリダイレクト
    return user ? children : <Navigate to="/login" />;
} 