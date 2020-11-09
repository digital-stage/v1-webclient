/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Flex } from 'theme-ui';
import NavItem from '../NavItem';

const SideBar = (props: {
  upperLinks?: NavItem[];
  centeredLinks?: NavItem[];
  lowerLinks?: NavItem[];
  selected?: NavItem;
  onSelected: (navItem: NavItem) => void;
}) => {
  const { upperLinks, centeredLinks, lowerLinks, onSelected, selected } = props;

  const SideBarItem = (item, index) => (
    <Box
      selected={selected && item.label === selected.label}
      tabIndex={index}
      role="presentation"
      onClick={() => onSelected(item)}
      sx={{
        width: '100%',
        color: 'text',
        bg: 'primary',
        px: '1rem',
        outline: 'none',
      }}
    >
      {item.icon ? item.icon : item.label}
    </Box>
  );

  return (
    <Flex role="menu" sx={{ flexDirection: 'column', bg: 'red' }}>
      {upperLinks &&
        upperLinks.map((item, index) => (
          <SideBarItem item={item} key={index} index={index} selected={selected} />
        ))}
      {centeredLinks &&
        centeredLinks.map((item, index) => (
          <SideBarItem item={item} key={index} index={index} selected={selected} />
        ))}
      {lowerLinks &&
        lowerLinks.map((item, index) => (
          <SideBarItem item={item} key={index} index={index} selected={selected} />
        ))}
    </Flex>
  );
};

export default SideBar;
