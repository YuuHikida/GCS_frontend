import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

// Firebase設定オブジェクト
// 環境変数から各種キーを取得（セキュリティのため）
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
// Firebase認証インスタンスを取得
export const auth = getAuth(app);

// バックエンドのベースURLを環境変数から取得
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// カスタムフック: 認証状態の管理と認証関連の機能を提供
export const useAuth = () => {
  // ユーザー情報の状態管理
  const [user, setUser] = useState(null);
  // ローディング状態の管理
  const [loading, setLoading] = useState(true);
  // 新規登録用のデータを保持するstate
  const [registrationData, setRegistrationData] = useState(null);

  // Googleログイン処理を行う関数
  const login = async () => {
    try {
      // Firebase認証インスタンスとGoogleプロバイダーを取得
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      // Googleログインポップアップを表示し、認証結果を取得
      const result = await signInWithPopup(auth, provider);
      
      // Firebase認証トークンを取得
      const token = await result.user.getIdToken();
      
      // URLを環境変数を使用して構築
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // バックエンドからのレスポンスをJSONとして解析
      const userData = await response.json();
      
      // ユーザー情報をステートに保存
      setUser(userData.user);
      
      // 新規ユーザーの場合、登録用データを保存
      if (userData.isNewUser) {
        setRegistrationData({
          email: userData.user.email,
          name: userData.user.name,
          googleId: userData.user.googleId,
          // 他の必要なデータ
        });
      }
      
      // ログイン結果を返す
      return {
        success: true,
        isNewUser: userData.isNewUser,
        user: userData.user
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Firebase認証状態の監視を設定
  
  useEffect(() => {
    // ユーザーの認証状態が変更されたときに呼び出される関数
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // ユーザーが認証されている場合
        const token = await firebaseUser.getIdToken();
        try {
          // ここも同様に環境変数を使用
          const response = await fetch(`${API_BASE_URL}/api/auth/verify-token`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          const userData = await response.json();
          setUser(userData.user);
        } catch (error) {
          console.error('ユーザー認証エラー:', error);
        }
      } else {
        // ユーザーが認証されていない場合
        setUser(null);
      }
      // ローディング状態を解除
      setLoading(false);
    });

    // コンポーネントのアンマウント時にリスナーを解除
    return () => unsubscribe();
  }, []);

  // ログアウト処理を行う関数
  const logout = async () => {
    const auth = getAuth();
    try {
      // Firebaseからログアウト
      await auth.signOut();
      // ユーザー情報をクリア
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  // フックから必要な値と関数を返す
  return {
    user,      // ユーザー情報
    loading,   // ローディング状態
    login,     // ログイン関数
    logout,    // ログアウト関数
    registrationData,  // 新規登録用データを追加
    setRegistrationData  // 必要に応じてセッター関数も公開
  };
};