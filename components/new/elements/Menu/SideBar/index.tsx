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
  const SideBarItem = ({ item, index }: { item: any; index: number }) => {
    /** TODO: instead of selected find a new way to markthe item active */
    return (
      <Box
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
      {UpperNavItems &&
        UpperNavItems.map((item, index) => <SideBarItem item={item} key={index} index={index} />)}
      {CenteredNavItems &&
        CenteredNavItems.map((item, index) => (
          <SideBarItem item={item} key={index} index={index} />
        ))}
      {LowerNavItems &&
        LowerNavItems.map((item, index) => <SideBarItem item={item} key={index} index={index} />)}
    </Flex>
  );
};

export default SideBar;
