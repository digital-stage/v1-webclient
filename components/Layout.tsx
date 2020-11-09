/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box } from 'theme-ui';
import PageSpinner from './PageSpinner';
import { useAuth } from '../lib/digitalstage/useAuth';

const Layout = (props: { children: React.ReactNode; sidebar?: boolean }): JSX.Element => {
  const { children, sidebar = false } = props;
  const { loading } = useAuth();

  return (
    <Box
      sx={{
        background:
          'transparent linear-gradient(221deg, #F20544 0%, #F00544 2%, #F20544 2%, #F20544 10%, #721542 50%, #012340 100%) 0% 0% no-repeat padding-box',
        minHeight: '100vh',
      }}
    >
      {loading ? (
        <PageSpinner />
      ) : (
        <Box
          sx={{
            display: 'grid',
            width: '100%',
            gridTemplateColumns: sidebar ? '80px 1fr' : '1fr',
            gridTemplateRows: '72px 1fr',
          }}
        >
          {sidebar && (
            <Box
              sx={{
                gridColumn: '1 / 2',
                gridRow: '1 / 3',
                height: '100vh',
                bg: 'red',
              }}
            >
              SideNav
            </Box>
          )}
          <Box
            sx={{
              height: '72px',
              bg: 'blue',
            }}
          >
            TopNav
          </Box>
          <Box
            sx={{
              minHeight: 'calc(100vh - 72px)',
              bg: 'pink',
            }}
          >
            {children}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Layout;
