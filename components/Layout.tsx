/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box } from 'theme-ui';
import PageSpinner from './PageSpinner';
import { useAuth } from '../lib/digitalstage/useAuth';
import SideNavigation from './new/elements/Menu/SideBar';

const Layout = (props: { children: React.ReactNode; sidebar?: boolean }): JSX.Element => {
  const { children, sidebar = false } = props;
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
              height: '72px',
              bg: ['red', 'blue'],
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
