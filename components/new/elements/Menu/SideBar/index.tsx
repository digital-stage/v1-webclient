/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Flex } from 'theme-ui';
import NavItem from '../NavItem';
import { CenteredNavItems, LowerNavItems } from '../../PageWrapperWithStage/MenuItems';
import DigitalStageLogo from '../../../../DigitalStageLogo';

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
          textAlign: 'center',
          py: 2,
        }}
      >
        {item.icon ? item.icon : item.label} {item.label}
      </Box>
    );
  };

  return (
    <Flex
      role="menu"
      py={3}
      sx={{
        flexDirection: 'column',
        bg: 'gray.6',
        minHeight: '100vh',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box>
        <DigitalStageLogo single icon width={30} />
      </Box>
      <Box>
        {CenteredNavItems &&
          CenteredNavItems.map((item, index) => (
            <SideBarItem item={item} key={index} index={index} />
          ))}
      </Box>
      <Box>
        {LowerNavItems &&
          LowerNavItems.map((item, index) => <SideBarItem item={item} key={index} index={index} />)}
      </Box>
    </Flex>
  );
};

export default SideBar;
