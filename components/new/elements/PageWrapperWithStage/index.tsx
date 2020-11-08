import React, { useState } from 'react';
import { styled } from 'baseui';
import { useAuth } from '../../../../lib/digitalstage/useAuth';
import Modal from '../Modal';
import NavItem from '../Menu/NavItem';
import SideBar from '../Menu/SideBar';
import AppBar from '../Menu/AppBar';
import { CenteredNavItems, LowerNavItems, UpperNavItems } from './MenuItems';

const Wrapper = styled('div', ({ $theme }) => ({
  width: '100%',
  height: '100%',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  [$theme.mediaQuery.medium]: {
    flexDirection: 'row'
  }
}));
const ContentWrapper = styled('div', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1
});

const DesktopSideBar = styled(SideBar, ({ $theme }) => ({
  display: 'none',
  flexGrow: 0,
  zIndex: 100,
  [$theme.mediaQuery.medium]: {
    display: 'flex'
  }
}));
const MobileAppBar = styled(AppBar, ({ $theme }) => ({
  display: 'flex',
  flexGrow: 0,
  [$theme.mediaQuery.medium]: {
    display: 'none'
  }
}));

const PageWrapperWithStage = (props: { children: React.ReactNode }) => {
  const { children } = props;

  const { user } = useAuth();

  const [currentItem, setCurrentItem] = React.useState<NavItem>();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);

  if (!user) {
    return <>{children}</>;
  }

  return (
    <Wrapper>
      <DesktopSideBar
        selected={currentItem}
        upperLinks={UpperNavItems}
        centeredLinks={CenteredNavItems}
        lowerLinks={LowerNavItems}
        onSelected={item => {
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
        onSelected={item => {
          if (currentItem && modalOpen && currentItem.label === item.label) {
            setModalOpen(false);
          } else {
            setCurrentItem(item);
            setModalOpen(true);
          }
        }}
      />
      <ContentWrapper>
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
      </ContentWrapper>
    </Wrapper>
  );
};

export default PageWrapperWithStage;
