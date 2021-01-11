/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Flex, Box } from 'theme-ui';
import SideBar from '../navigation/SideBar';
import { Fragment } from 'react';
import { useSelector } from '../../../lib/use-digital-stage/hooks';
import { CSSTransitionGroup } from 'react-transition-group';
import React from 'react';
import Link from 'next/link';
import { WhiteButton } from '../../../digitalstage-ui/elements/input/Button';
import { useRouter } from 'next/router';
import Logo from '../../../digitalstage-ui/elements/Logo';
import ProfileMenu from '../navigation/ProfileMenu';
import DeviceController from '../DeviceController';

const AnimatedBackground = (props: { dark: boolean }): JSX.Element => {
  const { dark } = props;
  return (
    <Fragment>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'transparent linear-gradient(221deg, #F20544 0%, #F00544 2%, #F20544 2%, #F20544 10%, #721542 50%, #012340 100%) 0% 0% no-repeat padding-box',
            backgroundAttachment: 'fixed',
          }}
        ></Box>
        <CSSTransitionGroup
          transitionName="gradientTransition"
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={500}
        >
          {dark && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'transparent linear-gradient(218deg, #343434 0%, #141414 100%) 0% 0% no-repeat padding-box',
                backgroundAttachment: 'fixed',
              }}
            />
          )}
        </CSSTransitionGroup>
      </Box>
    </Fragment>
  );
};

const StageLayout = (props: { children: React.ReactNode; projectName?: string }): JSX.Element => {
  const { children, projectName } = props;
  const stageId = useSelector((state) => state.global.stageId);
  const { pathname } = useRouter();

  return (
    <Flex
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        flexWrap: 'nowrap',
      }}
    >
      <Box
        sx={{
          transform: !!stageId ? undefined : 'translateX(-100%)',
          transition: 'transform .2s',
          flexGrow: 0,
        }}
      >
        <SideBar />
      </Box>

      <Flex
        sx={{
          minHeight: '100vh',
          flexGrow: 1,
          overflowY: 'scroll',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <AnimatedBackground dark={!!stageId} />

        {!stageId && (
          <Flex
            sx={{
              width: '100%',
              flexDirection: 'column',
              alignItems: 'center',
              px: 3,
              py: 4,
            }}
          >
            <Flex
              sx={{
                width: '100%',
                alignItems: 'center',
                mb: [5, null, 6],
                py: 4,
                px: [5, 7],
              }}
            >
              <Logo alt={projectName} width={110} full />
            </Flex>
          </Flex>
        )}

        {children}
      </Flex>

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
          <WhiteButton as="a">DE</WhiteButton>
        </Link>
        <Link href={pathname} locale="en">
          <WhiteButton as="a">EN</WhiteButton>
        </Link>
      </Flex>

      <ProfileMenu />

      <DeviceController />
    </Flex>
  );
};
export default StageLayout;
