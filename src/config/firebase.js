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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registrationData, setRegistrationData] = useState(null);

  const login = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseToken = await result.user.getIdToken();
      
      // バックエンドでトークン検証
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${firebaseToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      const verifyResult = await response.json();
      
      if (verifyResult.success) {
        // 新規ユーザーの場合はトークンを一時的に保持
        if (verifyResult.needsRegistration) {
          return {
            success: true,
            needsRegistration: true,
            temporaryToken: firebaseToken
          };
        } else {
          return {
            success: true,
            needsRegistration: false,
            token: firebaseToken
          };
        }
      } else {
        return {
          success: false,
          error: verifyResult.error || '認証に失敗しました'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  // 認証ヘッダーを取得するユーティリティ関数
  const getAuthHeaders = async () => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    }
    return {
      'Content-Type': 'application/json'
    };
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const headers = await getAuthHeaders();
          const response = await fetch(`${API_BASE_URL}/api/auth/verify-token`, {
            method: 'POST',
            headers
          });
          const userData = await response.json();
          setUser(userData.user);
        } catch (error) {
          console.error('認証エラー:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem('authToken');
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    registrationData,
    setRegistrationData,
    getAuthHeaders  // 新しく追加
  };
};