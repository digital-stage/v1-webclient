import { styled } from 'baseui';
import React, { useState } from 'react';
import { Menu } from 'baseui/icon';
import { Drawer } from 'baseui/drawer';
import NavItem from '../NavItem';

const AppBarWrapper = styled('div', {
  width: '100%',
  height: '72px',
});
const AppBarIcon = styled('div', {});
const AppBar = (props: {
  className?: string;
  navItems: NavItem[];
  onSelected: (navItem: NavItem) => void;
}) => {
  const { className, navItems, onSelected } = props;
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <AppBarWrapper role="menu" className={className}>
        <AppBarIcon onClick={() => setOpen((prev) => !prev)}>
          <Menu />
        </AppBarIcon>
      </AppBarWrapper>
      <Drawer
        overrides={{
          Root: {
            style: ({ $theme }) => ({
              [$theme.mediaQuery.medium]: {
                display: 'none',
              },
            }),
          },
        }}
        autoFocus
        closeable
        onClose={() => setOpen(false)}
        anchor="left"
        isOpen={open}
      >
        {navItems && navItems.map((item, index) => (
          <div
            tabIndex={index}
            role="presentation"
            onClick={() => {
              setOpen(false);
              onSelected(item);
            }}
          >
            {item.label}
          </div>
        ))}
      </Drawer>
    </>
  );
};
export default AppBar;
