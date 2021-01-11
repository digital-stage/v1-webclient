/** @jsxRuntime classic */
/** @jsx jsx */
import OverlayMenu from '../../../digitalstage-ui/elements/navigation/OverlayMenu';
import { useSelector } from '../../../lib/use-digital-stage/hooks';
import { User } from '../../../lib/use-digital-stage/types';
import React from 'react';
import { Divider, Flex, jsx, Text, Link as ThemeUiLink, Box, Button } from 'theme-ui';
import { useAuth } from '../../../lib/useAuth';
import Link from 'next/link';
import { FaCog, FaUserAlt } from 'react-icons/fa';
import { MdFeedback } from 'react-icons/md';

const ProfileMenu = (): JSX.Element => {
  const { user: authUser, logout } = useAuth();
  const user = useSelector<User>((state) =>
    state.global.userId ? state.users.byId[state.global.userId] : undefined
  );

  if (authUser) {
    return (
      <OverlayMenu
        styles={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          m: 3,
        }}
      >
        {user && (
          <Text
            variant="h5"
            sx={{
              color: 'text',
              mb: 3,
            }}
          >
            {user.name || user._id}
          </Text>
        )}
        {authUser && (
          <Text
            variant="micro"
            sx={{
              color: 'text',
              mb: 3,
            }}
          >
            {authUser.email}
          </Text>
        )}
        <Divider sx={{ color: 'text' }} />
        <Link href="/settings/profile">
          <Flex
            sx={{
              py: 3,
              alignItems: 'center',
              cursor: 'pointer',
              color: 'text',
            }}
            as="a"
          >
            <FaUserAlt name="edit" />
            <Text variant="h6" sx={{ color: 'text' }} ml={3}>
              Profil bearbeiten
            </Text>
          </Flex>
        </Link>
        <Link href="/settings">
          <Flex
            sx={{
              py: 3,
              alignItems: 'center',
              cursor: 'pointer',
              color: 'text',
            }}
            as="a"
          >
            <FaCog name="settings" />
            <Text variant="h6" sx={{ color: 'text' }} ml={3}>
              Einstellungen ändern
            </Text>
          </Flex>
        </Link>
        <ThemeUiLink
          sx={{
            display: 'flex',
            py: 3,
            alignItems: 'center',
            textDecoration: 'none',
            cursor: 'pointer',
            color: 'text',
          }}
          target="_blank"
          href="https://forum.digital-stage.org/c/deutsch/ds-web/30"
        >
          <MdFeedback name="feedback" />
          <Text variant="h6" sx={{ color: 'text' }} ml={3}>
            Feedback geben
          </Text>
        </ThemeUiLink>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button variant="primary" onClick={logout}>
            Ausloggen
          </Button>
        </Box>
      </OverlayMenu>
    );
  }
  return null;
};
export default ProfileMenu;
