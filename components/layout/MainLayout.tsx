/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Flex, Button, Box } from 'theme-ui';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import DeviceController from '../global/DeviceController';
import ProfileMenu from '../navigation/ProfileMenu';
import { useSelector } from '../../lib/use-digital-stage';
import { useAuth } from '../../lib/useAuth';
import LoadingOverlay from '../global/LoadingOverlay';
import ErrorPopup from './utils/ErrorPopup';
import SideBar from '../navigation/SideBar';
import NotificationCenter from '../global/NotificationCenter';
import MobileMenu from '../navigation/MobileMenu';

const MainLayout = (props: { children: React.ReactNode }): JSX.Element => {
  const { children } = props;
  const { pathname } = useRouter();
  const isInsideStage = useSelector<boolean>((state) => !!state.global.stageId);
  const { loading } = useAuth();

  return (
    <Flex
      sx={{
        position: 'relative',
        background:
          'transparent linear-gradient(221deg, #F20544 0%, #F00544 2%, #F20544 2%, #F20544 10%, #721542 50%, #012340 100%) 0% 0% no-repeat padding-box',
        backgroundAttachment: 'fixed',
        width: '100vw',
        height: '100vh',
        minHeight: '380px',
        flexDirection: 'column',
        zIndex: '1',
        '::before': {
          display: 'block',
          position: 'absolute',
          content: '""',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          background:
            'transparent linear-gradient(221deg, #343434 0%, #141414 100%) 0% 0% no-repeat padding-box',
          transitionProperty: 'opacity',
          transitionDuration: '200ms',
          transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.4, 1)',
          zIndex: '-1',
          opacity: isInsideStage ? '1' : '0',
        },
      }}
    >
      {loading ? (
        <LoadingOverlay />
      ) : (
        <React.Fragment>
          <Flex
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
              flexDirection: 'row',
            }}
          >
            <Flex
              sx={{
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: isInsideStage ? ['0', '86px'] : '0',
                transform: isInsideStage ? undefined : 'translateX(-200%)',
                transitionProperty: 'width, transform',
                transitionDuration: '200ms',
                transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.4, 1)',
                overflow: 'hidden',
                flexGrow: 0,
                flexShrink: 0,
              }}
            >
              <SideBar />
            </Flex>
            <Box
              sx={{
                minHeight: '100vh',
                overflow: 'auto',
                flexGrow: 1,
              }}
            >
              {children}
            </Box>
          </Flex>

          {!isInsideStage && (
            <Flex
              sx={{
                position: ['relative', 'fixed'],
                top: [undefined, '1rem'],
                right: [undefined, '4rem'],
                width: ['100%', 'auto'],
                justifyContent: ['center', undefined],
                pb: [5, undefined],
              }}
            >
              <Link href={pathname} locale="de">
                <Button variant="white" as="a">
                  DE
                </Button>
              </Link>
              <Link href={pathname} locale="en">
                <Button variant="white" as="a">
                  EN
                </Button>
              </Link>
            </Flex>
          )}

          <ProfileMenu />

          <DeviceController />

          <ErrorPopup />

          <NotificationCenter />

          <MobileMenu />
        </React.Fragment>
      )}
    </Flex>
  );
};
export default MainLayout;
