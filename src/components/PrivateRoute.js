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

    if (!user) {
        return <Navigate to="/" />;
    }

    // 登録が完了していない場合
    const isRegistered = localStorage.getItem(`registered_${user.uid}`);
    const registrationPending = localStorage.getItem('registration_pending');
    
    if (!isRegistered && registrationPending) {
        return <Navigate to="/register" />;
    }

    return children;
} 