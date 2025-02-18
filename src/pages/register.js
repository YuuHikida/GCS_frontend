import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../config/firebase';
import axios from 'axios';

/*概要説明等
目的：
    新規ユーザーが追加情報を入力するための登録フォームを提供
主な機能：
    ユーザー情報入力フォームの表示
    Google認証で取得した基本情報の表示
    GitHubユーザー名などの追加情報の収集
    登録情報のバックエンドへの送信
重要なポイント：
    Googleログインで取得した情報を初期値として表示
    必要な追加情報を収集
    登録完了後にダッシュボードへ遷移
*/

const Register = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // フォームデータの状態を管理
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    githubUsername: '',
  });

  // ユーザー情報が変更されたときに、フォームの初期値を設定
  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  // フォーム送信時の処理
  const handleSubmit = async (e) => {
    // フォームのデフォルト送信を防止
    e.preventDefault();
    try {
      // ユーザー登録APIを呼び出し
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          ...formData,
          googleId: user?.googleId, // GoogleIDを追加
        }
      );

      // 登録成功時はダッシュボードへ遷移
      if (response.data.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  // 登録フォームのUIをレンダリング
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">ユーザー登録</h1>
        <form onSubmit={handleSubmit}>
          {/* 名前入力フィールド */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              名前
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          {/* GitHubユーザー名入力フィールド */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              GitHubユーザー名
            </label>
            <input
              type="text"
              value={formData.githubUsername}
              onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          {/* 登録ボタン */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            登録
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;