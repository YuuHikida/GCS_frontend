import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import DisplayPopup from '../components/DisplayPopup';

const DeleteUser = ({ user }) => {
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const navigate = useNavigate();

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
                });

                const data = await response.json();
                // console.log("★data", data);
                if (data.success) {
                    toast.success("ユーザーが削除されました。");
                    setShowSuccessPopup(true);
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
            <Button
                onClick={handleDeleteUser}
                bg="red.500"
                color="white"
                w="100%"
                p={3}
                borderRadius="md"
                _hover={{
                    bg: 'red.600',
                    transform: 'translateY(-2px)'
                }}
                boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
            >
                削除
            </Button>
            <DisplayPopup
                isOpen={showSuccessPopup}
                onClose={() => setShowSuccessPopup(false)}
                message="削除完了しました"
                redirectPath="/welcome"
            />
        </div>
    );
};

export default DeleteUser; 