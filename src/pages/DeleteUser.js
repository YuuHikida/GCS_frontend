import React from 'react';
import { toast } from 'react-toastify';

const DeleteUser = ({ user }) => {
    const handleDeleteUser = async () => {
        if (window.confirm("本当にこのアカウントを削除しますか？")) {
            try {
                const idToken = await user.getIdToken();
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`
                    },
                    body: JSON.stringify({ uid: user.uid })
                });

                const data = await response.json();

                if (data.success) {
                    toast.success("ユーザーが削除されました。");
                    // 必要に応じて、ログアウトやリダイレクト処理を追加
                } else {
                    toast.error(data.message || "ユーザー削除に失敗しました。");
                }
            } catch (error) {
                console.error('エラー:', error);
                toast.error("削除中にエラーが発生しました。");
            }
        }
    };

    return (
        <div>
            <h2>ユーザー削除</h2>
            <p>このアカウントを削除しますか？</p>
            <button onClick={handleDeleteUser}>削除</button>
        </div>
    );
};

export default DeleteUser; 