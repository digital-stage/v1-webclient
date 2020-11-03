import React from 'react';
import { styled } from 'styletron-react';

const Wrapper = styled('div', {
  position: 'relative',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
});
const ItemContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid red',
});
const Item = styled('div', {});

interface BaseNavItem {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  drawer?: React.ReactNode;
}
export interface NavItem extends Omit<BaseNavItem, 'drawer'> {
  href?: string;
}
export interface DrawerNavItem extends Omit<BaseNavItem, 'href'> {
  drawer?: React.ReactNode;
}

const Sidebar = (props: {
  className?: string;
  upperItems?: Array<NavItem | DrawerNavItem>,
  centeredItems?: Array<NavItem | DrawerNavItem>,
  lowerItems?: Array<NavItem | DrawerNavItem>,
}) => {
  const {
    className, upperItems, centeredItems, lowerItems,
  } = props;
  return (
    <Wrapper className={className}>
      <ItemContainer>
        {upperItems && upperItems
          .map((item) => (item.icon
            ? item.icon
            : <Item>{item.label}</Item>
          ))}
      </ItemContainer>
      <ItemContainer>
        {centeredItems && centeredItems
          .map((item) => (item.icon
            ? item.icon
            : <Item>{item.label}</Item>
          ))}
      </ItemContainer>
      <ItemContainer>
        {lowerItems && lowerItems
          .map((item) => (item.icon
            ? item.icon
            : <Item>{item.label}</Item>
          ))}
      </ItemContainer>
    </Wrapper>
  );
};

export default Sidebar;
