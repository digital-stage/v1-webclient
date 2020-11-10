/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Flex } from 'theme-ui';
import NavItem from '../NavItem';
import {
  CenteredNavItems,
  LowerNavItems,
  UpperNavItems,
} from '../../PageWrapperWithStage/MenuItems';

const SideBar = ({
  selected,
  onSelected,
}: {
  selected?: NavItem;
  onSelected: (navItem: NavItem) => void;
}): JSX.Element => {
  const SideBarItem = ({
    item,
    index,
    selected2,
  }: {
    item: any;
    index: number;
    selected2: boolean;
  }) => {
    return (
      <Box
        selected={selected2 && item.label === selected2.label}
        tabIndex={index}
        role="presentation"
        onClick={() => onSelected(item)}
        sx={{
          //width: '100%',
          color: 'text',
          //bg: 'accent',
          px: '1rem',
          outline: 'none',
        }}
      >
        {item.icon ? item.icon : item.label} {item.label}
      </Box>
    );
  };

  return (
    <Flex role="menu" sx={{ flexDirection: 'column', bg: 'teal', minHeight: '100vh' }}>
      BERT
      {UpperNavItems &&
        UpperNavItems.map((item, index) => {
          return <SideBarItem item={item} key={index} index={index} selected2={selected} />;
        })}
      {CenteredNavItems &&
        CenteredNavItems.map((item, index) => (
          <SideBarItem item={item} key={index} index={index} selected2={selected} />
        ))}
      {LowerNavItems &&
        LowerNavItems.map((item, index) => (
          <SideBarItem item={item} key={index} index={index} selected2={selected} />
        ))}
    </Flex>
  );
};

export default SideBar;
