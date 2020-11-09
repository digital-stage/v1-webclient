/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import {
  jsx, Flex,
} from 'theme-ui';
import styled from '@emotion/styled';
import { useAuth } from '../../../../lib/digitalstage/useAuth';
import Modal from '../Modal';
import NavItem from '../Menu/NavItem';
import SideBar from '../Menu/SideBar';
import AppBar from '../Menu/AppBar';
import { CenteredNavItems, LowerNavItems, UpperNavItems } from './MenuItems';

const DesktopSideBar = styled(SideBar)({
  display: ['none', 'none'],
  flexGrow: 0,
  zIndex: 100,
});

const MobileAppBar = styled(AppBar)({
  display: ['flex', 'none'],
  flexGrow: 0,
});

const PageWrapperWithStage = (props: { children: React.ReactNode }) => {
  const { children } = props;

  const { user } = useAuth();

  const [currentItem, setCurrentItem] = React.useState<NavItem>();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);

  if (!user) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return (
    <Flex sx={{
      flexDirection: ['column', 'row'],
      width: '100%',
      height: '100%',
      minHeight: '100vh',
      bg: 'yellow',
    }}
    >
      <DesktopSideBar
        selected={currentItem}
        upperLinks={UpperNavItems}
        centeredLinks={CenteredNavItems}
        lowerLinks={LowerNavItems}
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
      <MobileAppBar
        navItems={[...UpperNavItems, ...CenteredNavItems, ...LowerNavItems]}
        onSelected={(item) => {
          if (currentItem && modalOpen && currentItem.label === item.label) {
            setModalOpen(false);
          } else {
            setCurrentItem(item);
            setModalOpen(true);
          }
        }}
      />
      <Flex sx={{
        flexDirection: 'column',
        flexGrow: 1,
      }}
      >
        {children}
        {currentItem && (
          <Modal
            size={currentItem.size}
            open={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setCurrentItem(undefined);
            }}
          >
            {currentItem.content}
          </Modal>
        )}
      </Flex>
    </Flex>
  );
};

export default PageWrapperWithStage;
