/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useCallback, useEffect, useRef } from 'react';
import { jsx, Flex, Input, Button, Box, Heading, Text, IconButton } from 'theme-ui';
import { useIntl } from 'react-intl';
import {
  ChatMessages,
  UsersCollection,
  useSelector,
  useStageActions,
} from '../../lib/use-digital-stage';
import { BiSend } from 'react-icons/bi';

const StageChat = (): JSX.Element => {
  const messages = useSelector<ChatMessages>((state) => state.chatMessages);
  const { sendChatMessage } = useStageActions();
  const users = useSelector<UsersCollection>((state) => state.users);
  const ownUserId = useSelector<string>((state) => state.global.userId);
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });
  const messageRef = useRef<HTMLInputElement>();
  const messagesEndRef = useRef<HTMLDivElement>();

  const onSendClicked = useCallback(() => {
    if (messageRef && sendChatMessage) {
      const msg = messageRef.current.value;
      if (msg.length > 0) {
        sendChatMessage(msg);
        messageRef.current.value = '';
      }
    }
  }, [messageRef, sendChatMessage]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesEndRef, messages]);

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      }}
    >
      <Flex
        sx={{
          flexGrow: 1,
          flexDirection: 'column',
          overflowX: 'hidden',
          overflowY: 'auto',
          bg: 'gray.6',
          borderRadius: 'card',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        {messages.map((message) => (
          <Flex
            sx={{
              flexDirection: 'column',
              alignSelf: 'flex-end',
              textAlign: message.userId === ownUserId ? 'right' : 'left',
              borderRadius: 'card',
              bg: message.userId === ownUserId ? 'primary' : 'tertiary',
              p: 4,
              mx: 4,
              mt: 2,
            }}
            key={message.time}
          >
            {message.userId !== ownUserId && (
              <Heading variant="h5">{users.byId[message.userId].name}</Heading>
            )}
            <Text variant="body">{message.message}</Text>
          </Flex>
        ))}
        <div ref={messagesEndRef} />
      </Flex>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSendClicked();
        }}
        sx={{
          display: 'flex',
          flexGrow: 0,
          width: '100%',
          pt: 3,
        }}
      >
        <Input
          ref={messageRef}
          sx={{
            flexGrow: 1,
            bg: 'gray.7',
          }}
          type="text"
        />
        <Button
          sx={{
            display: ['none', 'inline-block'],
            flexGrow: 0,
            ml: 4,
          }}
          type="submit"
          variant="primary"
        >
          {f('sendMessage')}
        </Button>
        <Box
          sx={{
            display: ['block', 'none'],
          }}
        >
          <IconButton type="submit" variant="icon">
            <BiSend name={f('sendMessage')} />
          </IconButton>
        </Box>
      </form>
    </Flex>
  );
};
export default StageChat;
