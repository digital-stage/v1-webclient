import { styled } from 'baseui';
import React from 'react';
import { Theme } from 'baseui/theme';
import NavItem from '../NavItem';

const SideBarWrapper = styled('div', ({ $theme }) => ({
  width: '55px',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: $theme.colors.backgroundPrimary,
}));

const SideBarItem = styled<{ $selected: boolean }, 'div', Theme>('div', ({ $theme, $selected }) => ({
  width: '100%',
  backgroundColor: $selected ? $theme.colors.backgroundSecondary : 'none',
}));

const SideBar = (props: {
  className?: string;
  upperLinks?: NavItem[];
  centeredLinks?: NavItem[];
  lowerLinks?: NavItem[];
  onSelected: (navItem: NavItem) => void;
  selected?: NavItem;
}) => {
  const {
    className, upperLinks, centeredLinks, lowerLinks, onSelected, selected,
  } = props;

  return (
    <SideBarWrapper role="menu" className={className}>
      {upperLinks && upperLinks.map((item, index) => (
        <SideBarItem
          $selected={selected && item.label === selected.label}
          tabIndex={index}
          role="presentation"
          onClick={() => onSelected(item)}
        >
          {item.icon ? item.icon : item.label}
        </SideBarItem>
      ))}
      {centeredLinks && centeredLinks.map((item, index) => (
        <SideBarItem
          $selected={selected && item.label === selected.label}
          tabIndex={index}
          role="presentation"
          onClick={() => onSelected(item)}
        >
          {item.icon ? item.icon : item.label}
        </SideBarItem>
      ))}
      {lowerLinks && lowerLinks.map((item, index) => (
        <SideBarItem
          $selected={selected && item.label === selected.label}
          tabIndex={index}
          role="presentation"
          onClick={() => onSelected(item)}
        >
          {item.icon ? item.icon : item.label}
        </SideBarItem>
      ))}
    </SideBarWrapper>
  );
};
export default SideBar;
