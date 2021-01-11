/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Flex } from 'theme-ui';
import React from 'react';
import Logo from '../../../digitalstage-ui/elements/Logo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { WhiteButton } from '../../../digitalstage-ui/elements/input/Button';
import ProfileMenu from '../navigation/ProfileMenu';
import DeviceController from '../DeviceController';

const StagesLayout = (props: { children: React.ReactNode; projectName?: string }): JSX.Element => {
  const { children, projectName } = props;
  const { pathname } = useRouter();

  return (
    <Flex
      sx={{
        background:
          'transparent linear-gradient(221deg, #F20544 0%, #F00544 2%, #F20544 2%, #F20544 10%, #721542 50%, #012340 100%) 0% 0% no-repeat padding-box',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        flexDirection: 'column',
      }}
    >
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
export default StagesLayout;
