/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Flex, Box, Button } from 'theme-ui';
import React from 'react';
import Logo from '../../digitalstage-ui/extra/Logo';
import { useIntl } from 'react-intl';

const AuthLayout = (props: { children: React.ReactNode }): JSX.Element => {
  const { children } = props;
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });

  return (
    <Flex
      sx={{
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        px: 3,
        py: 4,
      }}
    >
      <Box
        sx={{
          mb: [5, null, 6],
        }}
      >
        <Logo alt={f('projectName')} width={180} full />
      </Box>
      {children}
    </Flex>
  );
};
export default AuthLayout;
