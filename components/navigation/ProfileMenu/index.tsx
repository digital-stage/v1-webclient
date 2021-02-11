/** @jsxRuntime classic */
/** @jsx jsx */
import OverlayMenu from '../../../digitalstage-ui/extra/OverlayMenu';
import { useSelector } from '../../../lib/use-digital-stage/hooks';
import { User } from '../../../lib/use-digital-stage';
import React, { useState } from 'react';
import { Divider, Flex, jsx, Text, Link as ThemeUiLink, Box, Button } from 'theme-ui';
import { useAuth } from '../../../lib/useAuth';
import Link from 'next/link';
import { FaCog, FaUserAlt } from 'react-icons/fa';
import { MdCloudDownload, MdFeedback } from 'react-icons/md';
import { useIntl } from 'react-intl';
import DownloadClientOverlay from './DownloadClientOverlay';

const ProfileMenu = (): JSX.Element => {
  const { user: authUser, logout } = useAuth();
  const user = useSelector<User>((state) =>
    state.global.userId ? state.users.byId[state.global.userId] : undefined
  );
  const [open, setOpen] = useState<boolean>(false);
  const [downloadClientOpen, setDownloadClientOpen] = useState<boolean>(false);
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });

  if (authUser) {
    return (
      <React.Fragment>
        <OverlayMenu
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          styles={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
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
          <Link href="/stages">
            <Flex
              sx={{
                py: 3,
                alignItems: 'center',
                cursor: 'pointer',
                color: 'text',
              }}
              as="a"
              onClick={() => setOpen(false)}
            >
              <FaUserAlt name="edit" />
              <Text variant="h6" sx={{ color: 'text' }} ml={3}>
                {f('stages')}
              </Text>
            </Flex>
          </Link>
          <Link href="/settings/profile">
            <Flex
              sx={{
                py: 3,
                alignItems: 'center',
                cursor: 'pointer',
                color: 'text',
              }}
              title={f('editProfile')}
              as="a"
              onClick={() => setOpen(false)}
            >
              <FaUserAlt name="edit" />
              <Text variant="h6" sx={{ color: 'text' }} ml={3}>
                {f('editProfile')}
              </Text>
            </Flex>
          </Link>
          <Link href="/settings/device">
            <Flex
              sx={{
                py: 3,
                alignItems: 'center',
                cursor: 'pointer',
                color: 'text',
              }}
              title={f('editDevice')}
              as="a"
              onClick={() => setOpen(false)}
            >
              <FaCog name="settings" />
              <Text variant="h6" sx={{ color: 'text' }} ml={3} onClick={() => setOpen}>
                {f('editDevice')}
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
            title={f('giveFeedback')}
            href="https://forum.digital-stage.org/c/deutsch/ds-web/30"
          >
            <MdFeedback name="feedback" />
            <Text variant="h6" sx={{ color: 'text' }} ml={3}>
              {f('giveFeedback')}
            </Text>
          </ThemeUiLink>

          <Divider sx={{ color: 'text' }} />

          <Flex
            sx={{
              py: 3,
              alignItems: 'center',
              cursor: 'pointer',
              color: 'text',
            }}
            title={f('clientDownload')}
            as="a"
            onClick={() => setOpen(false)}
          >
            <MdCloudDownload name={f('clientDownload')} />
            <Text
              variant="h6"
              sx={{ color: 'text' }}
              ml={3}
              onClick={() => setDownloadClientOpen(true)}
            >
              {f('clientDownload')}
            </Text>
          </Flex>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button variant="primary" title={f('signOut')} onClick={logout}>
              {f('signOut')}
            </Button>
          </Box>
        </OverlayMenu>
        <DownloadClientOverlay
          isOpen={downloadClientOpen}
          onClose={() => setDownloadClientOpen(false)}
        />
      </React.Fragment>
    );
  }
  return null;
};
export default ProfileMenu;
