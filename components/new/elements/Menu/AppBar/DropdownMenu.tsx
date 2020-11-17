/* eslint-disable react/destructuring-assignment */
/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Box, Text, Divider, Button, Flex } from 'theme-ui';
import { useAuth } from '../../../../../lib/digitalstage/useAuth';
import useStageSelector from '../../../../../lib/digitalstage/useStageSelector';
import { AppBarItems } from '../../PageWrapperWithStage/MenuItems';

interface Props {
  onClose(): void;
  isOpen: boolean;
  onSelect(selected: string): any;
}

// TODO add German translation
const DropdownMenu = (props: Props) => {
  const { user: authUser, logout } = useAuth();
  const { user } = useStageSelector((state) => ({ user: state.user }));

  return props.isOpen ? (
    <Box
      sx={{
        position: 'fixed',
        bg: 'gray.5',
        padding: 3,
        width: 'auto',
        height: 'auto',
        top: '58px',
        right: '22px',
        p: 4,
        boxShadow: '0px 3px 6px #000000BC',
        zIndex: 999,
      }}
    >
      <Text variant="title" sx={{ color: 'text' }} mb={3}>
        {user.name}
      </Text>
      <Text variant="subTitle" sx={{ color: 'text' }} mb={3}>
        {authUser.email}
      </Text>
      <Divider sx={{ color: 'text' }} />
      {AppBarItems.map((item, i) => {
        return (
          <Flex
            key={i}
            py={2}
            sx={{ alignItems: 'center', cursor: 'pointer' }}
            onClick={() => props.onSelect(item.href)}
          >
            {item.icon}
            <Text variant="title" sx={{ color: 'text' }} ml={2}>
              {item.label}
            </Text>
          </Flex>
        );
      })}
      <Box sx={{ textAlign: 'right' }}>
        <Button variant="secondary" onClick={logout}>
          Sign out
        </Button>
      </Box>
    </Box>
  ) : null;
};
export default DropdownMenu;
