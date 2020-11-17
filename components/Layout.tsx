/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box } from 'theme-ui';
import DigitalStageLogo from './DigitalStageLogo';
import PageSpinner from './PageSpinner';
import { useAuth } from '../lib/digitalstage/useAuth';
import SideNavigation from './new/elements/Menu/SideBar';
import TopNavigation from './new/elements/Menu/AppBar';

interface Props {
  children: React.ReactNode;
  sidebar?: boolean;
  auth?: boolean;
}

const Layout = ({ children, sidebar, auth }: Props): JSX.Element => {
  const { loading } = useAuth();

  const [currentItem, setCurrentItem] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);

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
      ) : auth ? (
        <Box>{children}</Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            width: '100%',
            gridTemplateColumns: sidebar ? ['1fr', '80px 1fr'] : '1fr',
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
                display: ['none', 'flex'],
                flexGrow: 0,
                zIndex: 100,
              }}
            >
              <SideNavigation
                selected={currentItem}
                onSelected={(item) => {
                  if (currentItem && modalOpen && currentItem.label === item.label) {
                    setModalOpen(false);
                    setCurrentItem(item);
                  } else {
                    setCurrentItem(item);
                    setModalOpen(true);
                  }
                }}
              />
            </Box>
          )}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebar ? 'flex-end' : 'space-between',
              height: '72px',
              py: 2,
              px: [3, 4],
              //bg: ['red', 'blue'],
            }}
          >
            {sidebar || (
              <Box>
                <DigitalStageLogo single />
              </Box>
            )}
            <TopNavigation
            /*
                //TODO: @Timonela, I uncommented this in favor to build
              onSelected={(item) => {
                if (currentItem && modalOpen && currentItem.label === item.label) {
                  setModalOpen(false);
                } else {
                  setCurrentItem(item);
                  setModalOpen(true);
                }
              }}*/
            />
          </Box>

          <Box
            sx={{
              minHeight: 'calc(100vh - 72px)',
              bg: sidebar && 'background',
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
