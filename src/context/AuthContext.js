import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { 
    signInWithPopup, 
    GoogleAuthProvider,
    signOut 
} from 'firebase/auth';

/**
 * 認証状態を管理するコンテキスト
 * アプリケーション全体で認証状態を共有するために使用
 */
// createContextは共有スペースを作成する
const AuthContext = createContext();

/**
 * 認証コンテキストを使用するためのカスタムフック
 * useAuthを呼ぶことで認証状態を取得できる=(AuthContextの値を取得できる)
 */
export function useAuth() {
    return useContext(AuthContext);
}

/**
 * 認証状態を提供するプロバイダーコンポーネント
 * 
 * 主な機能:
 * - Googleログイン処理
 * - ログアウト処理
 * - 認証状態の監視と管理
 * - ローディング状態の管理
 */
export function AuthProvider({ children }) {
    //現在ログインしているユーザー情報を管理
    const [user, setUser] = useState(null);
    //ローディング状態を管理    
    const [loading, setLoading] = useState(true);

    // Googleログイン処理に登録状態チェックを追加
    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            // 新規ユーザーの場合、未登録フラグを設定
            if (!localStorage.getItem(`registered_${result.user.uid}`)) {
                localStorage.setItem('registration_pending', 'true');
            }
            return result.user;
        } catch (error) {
            console.error("Google login failed:", error);
            throw error;
        }
    };

    // ログアウト処理
    const logout = () => {
        return signOut(auth);
    };

    // 登録完了を記録する関数を追加
    const completeRegistration = (uid) => {
        localStorage.setItem(`registered_${uid}`, 'true');
        localStorage.removeItem('registration_pending');
    };

    // Firebase認証の状態を監視
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user);
            setLoading(false);
        });

        // クリーンアップ関数
        return unsubscribe;
    }, []);

    // コンテキストで共有する値
    const value = {
        user,
        loginWithGoogle,
        logout,
        completeRegistration  // 新しい関数を追加
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
} 