/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { Box, Flex, Heading, jsx, Link as ThemeLink } from 'theme-ui';
import Logo from '../../digitalstage-ui/extra/Logo';
import { GoBroadcast, GoListUnordered, GoSettings } from 'react-icons/go';
import { BiChat, BiCube } from 'react-icons/bi';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import { useSelector } from '../../lib/use-digital-stage';
import { FaBug, FaTools } from 'react-icons/fa';
import { useRouter } from 'next/router';

const SideBarItem = (props: { children: React.ReactNode; active?: boolean }): JSX.Element => {
  const { children, active } = props;
  return (
    <Flex
      role="presentation"
      sx={{
        outline: 'none',
        textAlign: 'center',
        py: 3,
        cursor: 'pointer',
        flexDirection: 'column',
        alignItems: 'center',
        textDecoration: 'none',
        transitionProperty: 'text-shadow, background',
        transitionDuration: '200ms',
        transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.4, 1)',
        bg: active ? 'transparent' : 'gray.7',
        ':hover': {
          textShadow: '0 0 10px #fff',
        },
      }}
    >
      {children}
    </Flex>
  );
};

const SideBar = (): JSX.Element => {
  const { pathname } = useRouter();
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });
  const isInsideStage = useSelector<boolean>((state) => !!state.global.stageId);
  return (
    <Flex
      role="menu"
      sx={{
        flexDirection: 'column',
        height: '100%',
        alignItems: 'center',
        flexGrow: 0,
      }}
    >
      <Box
        sx={{
          width: '100%',
          textAlign: 'center',
          flexGrow: 0,
          pt: 5,
          bg: 'gray.7',
        }}
      >
        <ThemeLink
          sx={{
            color: 'text',
            bg: 'gray.7',
          }}
          href="https://www.digital-stage.org"
          target="_blank"
          title={f('projectName')}
        >
          <Logo full={false} width={30} />
        </ThemeLink>
      </Box>
      <Box
        sx={{
          width: '100%',
          flexGrow: 1,
          bg: 'gray.7',
        }}
      />
      <Box
        sx={{
          flexGrow: 0,
        }}
      >
        {isInsideStage && (
          <React.Fragment>
            <Link href="/stage">
              <ThemeLink title={f('stage')}>
                <SideBarItem active={pathname === '/stage'}>
                  <GoBroadcast name={f('stage')} />
                  <Heading variant="body">{f('stage')}</Heading>
                </SideBarItem>
              </ThemeLink>
            </Link>
            <Link href="/mixer">
              <ThemeLink title={f('mixer')}>
                <SideBarItem active={pathname === '/mixer'}>
                  <GoSettings name={f('mixer')} />
                  <Heading variant="body">{f('mixer')}</Heading>
                </SideBarItem>
              </ThemeLink>
            </Link>
            <Link href="/room">
              <ThemeLink title={f('room')}>
                <SideBarItem active={pathname === '/room'}>
                  <BiCube name={f('room')} />
                  <Heading variant="body">{f('room')}</Heading>
                </SideBarItem>
              </ThemeLink>
            </Link>
            <Link href="/chat">
              <ThemeLink title={f('chat')}>
                <SideBarItem active={pathname === '/chat'}>
                  <BiChat name={f('chat')} />
                  <Heading variant="body">{f('chat')}</Heading>
                </SideBarItem>
              </ThemeLink>
            </Link>
            <Link href="/settings/device">
              <ThemeLink title={f('settings')}>
                <SideBarItem active={pathname.startsWith('/settings')}>
                  <FaTools name={f('settings')} />
                  <Heading variant="body">{f('settings')}</Heading>
                </SideBarItem>
              </ThemeLink>
            </Link>
          </React.Fragment>
        )}
        <Link href="/stages">
          <ThemeLink title={f('stages')}>
            <SideBarItem active={pathname === '/stages'}>
              <GoListUnordered name={f('stages')} />
              <Heading variant="body">{f('stages')}</Heading>
            </SideBarItem>
          </ThemeLink>
        </Link>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          bg: 'gray.7',
          width: '100%',
        }}
      />
      <Box
        sx={{
          pb: 5,
          bg: 'gray.7',
        }}
      >
        <ThemeLink
          href="https://forum.digital-stage.org/c/deutsch/ds-web/30"
          target="_blank"
          title={f('feedback')}
          sx={{
            color: 'text',
            textDecoration: 'none',
          }}
        >
          <SideBarItem>
            <FaBug name={f('feedback')} />
            <Heading variant="body">{f('feedback')}</Heading>
          </SideBarItem>
        </ThemeLink>
      </Box>
    </Flex>
  );
};
export default SideBar;
