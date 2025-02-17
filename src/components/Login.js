import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

/*概要説明等
目的：ユーザーがGoogleアカウントでログインするための画面を提供
主な機能：
Googleログインボタンの表示
ログイン処理の実行
ログイン後の画面遷移制御（新規/既存ユーザーで分岐）
重要なポイント：
AuthContextの機能を使用してログイン処理を実行
ログイン結果に応じて適切な画面（登録/ダッシュボード）に遷移
*/

const Login = () => {
  // Next.jsのルーター機能とカスタム認証フックを初期化
  const router = useRouter();
  const { login } = useAuth();

  // Googleログインボタンのクリックハンドラー
  const handleGoogleLogin = async () => {
    try {
      // AuthContextで定義したログイン処理を実行
      const result = await login();
      
      // ログインが成功した場合の処理
      if (result.success) {
        if (result.isNewUser) {
          // 新規ユーザーの場合は登録画面(/register)へ遷移
          router.push('/register');
        } else {
          // 既存ユーザーの場合はダッシュボード(/dashboard)へ遷移
          router.push('/dashboard');
        }
      }
    } catch (error) {
      // エラーが発生した場合はコンソールに出力
      console.error('Login failed:', error);
    }
  };

  // ログイン画面のUIをレンダリング
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Googleでログイン
        </button>
      </div>
    </div>
  );
};

export default Login;