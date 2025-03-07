import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

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
export const useAuth = () => useContext(AuthContext);
// バックエンドのベースURLを環境変数から取得
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
/**
 * 認証状態を提供するプロバイダーコンポーネント
 * 
 * 主な機能:
 * - Googleログイン処理
 * - ログアウト処理
 * - 認証状態の監視と管理
 * - ローディング状態の管理
 */
export const AuthProvider = ({ children }) => {
    //現在ログインしているユーザー情報を管理
    const [user, setUser] = useState(null);
    //ローディング状態を管理    
    const [loading, setLoading] = useState(true);

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            return result.user;
        } catch (error) {
            console.error("Google login error:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await auth.signOut();
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const registerUser = async (temporaryToken, userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${temporaryToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('登録エラー:', error);
            return { success: false, error: error.message };
        }
    };

    const getAuthHeaders = () => {
        return {
            'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
        };
    };

    // Firebase認証の状態を監視
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // コンテキストで共有する値
    const value = {
        user,
        loading,
        loginWithGoogle,
        logout,
        registerUser,
        getAuthHeaders
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 