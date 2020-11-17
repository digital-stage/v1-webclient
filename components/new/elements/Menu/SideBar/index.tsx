/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Flex } from 'theme-ui';
import NavItem from '../NavItem';
import { CenteredNavItems, LowerNavItems } from '../../PageWrapperWithStage/MenuItems';
import DigitalStageLogo from '../../../../DigitalStageLogo';
import SettingsModal from '../../../../settings';

const SideBar = (): JSX.Element => {
  const [selected, setSelected] = React.useState<string>();
  const [openSettings, setOpenSettings] = React.useState<boolean>(false);

  const SideBarItem = ({ item, index }: { item: NavItem; index: number }) => {
    /** TODO: instead of selected find a new way to markthe item active */
    console.log(item);
    return (
      <Box
        tabIndex={index}
        role="presentation"
        onClick={() => {
          if (item.href !== 'mixer') {
            setSelected(item.href);
            setOpenSettings(true);
          }
        }}
        sx={{
          color: 'text',
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
        cursor: 'pointer',
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
      <SettingsModal
        isOpen={openSettings}
        onClose={() => setOpenSettings(!openSettings)}
        selected={selected}
      />
    </Flex>
  );
};

export default SideBar;
