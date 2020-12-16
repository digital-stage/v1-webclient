/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { Box, Heading, jsx, Link } from 'theme-ui';
import { Stage } from '../lib/use-digital-stage';
import { useAuth } from '../lib/useAuth';
import DigitalStageLogo from './DigitalStageLogo';
import TopNavigation from './global/AppBar';
import SideNavigation from './global/SideBar';
import PageSpinner from './PageSpinner';

interface Props {
  children: React.ReactNode;
  sidebar?: boolean;
  auth?: boolean;
  stage?: Stage;
}

const LOADER_DEACTIVATED = true;

const Layout = ({ children, sidebar, auth, stage }: Props): JSX.Element => {
  const { loading } = useAuth();

  return (
    <Box
      sx={{
        background:
          'transparent linear-gradient(221deg, #F20544 0%, #F00544 2%, #F20544 2%, #F20544 10%, #721542 50%, #012340 100%) 0% 0% no-repeat padding-box',
        minHeight: '100vh',
      }}
    >
      {!LOADER_DEACTIVATED && loading ? (
        <PageSpinner />
      ) : auth ? (
        <Box>{children}</Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            width: '100%',
            gridTemplateColumns: sidebar ? ['1fr', '80px 1fr'] : '1fr',
            gridTemplateRows: ['0 72px 1fr', '72px 1fr'],
          }}
        >
          {sidebar && (
            <Box
              sx={{
                gridColumn: '1 / 2',
                gridRow: '1 / 3',
                height: '100vh',
                bg: 'red',
                display: ['contents', 'flex'],
                flexGrow: 0,
                zIndex: 50,
              }}
            >
              <SideNavigation />
            </Box>
          )}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '72px',
              py: 4,
              px: [5, 7],
              bg: !sidebar ? 'transparent' : '#1c1c1c',
            }}
          >
            {sidebar || (
              <Box>
                <DigitalStageLogo single />
              </Box>
            )}
            {sidebar && (
              <Box sx={{ display: ['block', 'none'] }}>
                <Link sx={{ color: 'text' }} href="https://www.digital-stage.org" target="_blank">
                  <DigitalStageLogo single icon width={30} />
                </Link>
              </Box>
            )}
            {sidebar && stage && (
              <Box>
                <Heading>{stage.name}</Heading>
              </Box>
            )}
            <div>
              <TopNavigation />
            </div>
          </Box>

          <Box
            sx={{
              minHeight: 'calc(100vh - 72px)',
              bg: sidebar && '#1c1c1c',
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
