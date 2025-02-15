import { createContext, useContext, useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import axios from 'axios';

/*概要説明等
目的：アプリケーション全体で使用する認証状態の管理と認証関連の機能を提供
主な機能：
ユーザーのログイン状態の管理
Googleログイン処理の実装
バックエンドとの認証連携
ログアウト処理
*/

// 認証情報を保持するContextを作成
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ユーザー情報の状態を管理
  const [user, setUser] = useState(null);

  // Googleログイン処理を実行する関数
  const login = async () => {
    try {
      // Firebase認証インスタンスとGoogleプロバイダーを初期化
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      
      // Googleポップアップでログインを実行
      const result = await signInWithPopup(auth, provider);
      // ログイン成功後、IDトークンを取得
      const idToken = await result.user.getIdToken();

      // バックエンドのトークン検証APIを呼び出し
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-token`,
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      // APIレスポンスが成功の場合
      if (response.data.success) {
        // ユーザー情報をステートに保存
        setUser(response.data.user);
        // ログイン結果を返す（新規ユーザーかどうかの情報を含む）
        return {
          success: true,
          isNewUser: response.data.isNewUser,
          user: response.data.user
        };
      }

      return { success: false };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false };
    }
  };

  // ログアウト処理を実行する関数
  const logout = async () => {
    try {
      const auth = getAuth();
      // Firebaseからログアウト
      await auth.signOut();
      // ユーザー情報をクリア
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // AuthContextの値を提供するProvider
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// カスタムフック: AuthContextの値を簡単に取得するために使用
export const useAuth = () => {
  return useContext(AuthContext);
};