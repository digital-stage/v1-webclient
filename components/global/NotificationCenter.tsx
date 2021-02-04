/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Box, Close, Flex, Text, jsx, SxStyleProp } from 'theme-ui';
import { Portal } from 'react-portal';
import { ChatMessages, useSelector } from '../../lib/use-digital-stage';
import Link from 'next/link';

interface Notification {
  message: string;
  href?: string;
  timeout?: any;
  visible: boolean;
}

const NotificationCenter = (): JSX.Element => {
  const messages = useSelector<ChatMessages>((state) => state.chatMessages);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const userId = useSelector<string>((state) => state.global.userId);

  const hideNotification = useCallback((index: number) => {
    console.log('HIDE ' + index);
    setNotifications((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            visible: false,
          };
        }
        return item;
      })
    );
  }, []);

  const addNotification = useCallback((message: string, href?: string) => {
    setNotifications((prev) => {
      const index = prev.length;
      const notification: Notification = {
        message: message,
        href: href,
        visible: true,
      };
      notification.timeout = setTimeout(() => {
        hideNotification(index);
      }, 3000);
      return [...prev, notification];
    });
  }, []);

  useEffect(() => {
    // new message
    if (messages.length > 0) {
      const message = messages[messages.length - 1];
      if (message.userId !== userId) {
        addNotification(message.message, '/chat');
      }
    }
  }, [messages, userId]);

  useEffect(() => {
    return () => {
      notifications.forEach((notification) => clearTimeout(notification.timeout));
    };
  }, []);

  return (
    <Portal>
      <Box
        sx={{
          position: 'fixed',
          top: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: '2',
        }}
      >
        {notifications.map(
          (notification, index) =>
            notification.visible && (
              <Alert key={index}>
                {notification.href ? (
                  <Link href={notification.href}>
                    <Text
                      variant="micro"
                      sx={{
                        cursor: 'pointer',
                      }}
                    >
                      {notification.message}
                    </Text>
                  </Link>
                ) : (
                  notification.message
                )}
                <Close
                  ml="auto"
                  mr={-2}
                  onClick={() => {
                    hideNotification(index);
                  }}
                />
              </Alert>
            )
        )}
      </Box>
    </Portal>
  );
};
export default NotificationCenter;
