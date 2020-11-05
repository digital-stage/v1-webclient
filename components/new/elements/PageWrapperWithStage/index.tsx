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
    flexDirection: 'row',
  },
}));
const ContentWrapper = styled('div', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
});

const DesktopSideBar = styled(SideBar, ({ $theme }) => ({
  display: 'none',
  flexGrow: 0,
  zIndex: 100, // TODO: Replace zindex by adding the modal at the end of the dom tree
  [$theme.mediaQuery.medium]: {
    display: 'flex',
  },
}));
const MobileAppBar = styled(AppBar, ({ $theme }) => ({
  display: 'flex',
  flexGrow: 0,
  [$theme.mediaQuery.medium]: {
    display: 'none',
  },
}));

const PageWrapperWithStage = (props: {
  children: React.ReactNode
}) => {
  const { children } = props;
  /**
     * For sign/sinup process only show a full page wrapper and the components.
     * When beeing signed in, show either the stage list or stage view always,
     * and insert the responding modals as requested.
     */
  const { loading, user } = useAuth();
  const [currentItem, setCurrentItem] = useState<NavItem>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  if (!loading) {
    if (!user) {
      return (
        <>
          {children}
        </>
      );
    }

    return (
      <Wrapper>
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
          navItems={[
            ...UpperNavItems,
            ...CenteredNavItems,
            ...LowerNavItems,
          ]}
          onSelected={(item) => {
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
  }

  return (
    <div>Loading</div>
  );
};

export default PageWrapperWithStage;
