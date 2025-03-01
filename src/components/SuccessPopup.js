import React, { useEffect } from 'react';
import {
  Box,
  Text,
  Center,
  Portal,
} from '@chakra-ui/react';
import { FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function SuccessPopup({ isOpen, onClose, message = "完了しました" }) {
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (isOpen) {

      timer = setTimeout(() => {
        try {
          navigate('/dashboard', { replace: true });
        } catch (error) {
          console.error('Navigation failed:', error);
        }
        onClose();
      }, 1800);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isOpen, onClose, navigate]);

  if (!isOpen) return null;

  return (
    <Portal>
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="rgba(0, 0, 0, 0.6)"
        zIndex="modal"
        display="flex"
        alignItems="center"
        justifyContent="center"
        transition="opacity 0.3s ease-in-out"
        opacity={isOpen ? 1 : 0}
      >
        <Box
          bg="white"
          p={8}
          borderRadius="2xl"
          boxShadow="2xl"
          maxW="md"
          mx={4}
          transform={isOpen ? 'scale(1)' : 'scale(0.9)'}
          transition="transform 0.3s ease-in-out"
        >
          <Center flexDirection="column">
            <Box
              bg="green.200"
              p={4}
              borderRadius="full"
              mb={6}
            >
              <FiCheck
                size={40}
                color="var(--chakra-colors-green-600)"
              />
            </Box>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              textAlign="center"
              color="gray.900"
            >
              {message}
            </Text>
          </Center>
        </Box>
      </Box>
    </Portal>
  );
}

export default SuccessPopup; 