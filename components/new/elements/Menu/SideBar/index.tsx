/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Flex, Link } from 'theme-ui';
import NavItem from '../NavItem';
import { CenteredNavItems, LowerNavItems } from '../../PageWrapperWithStage/MenuItems';
import DigitalStageLogo from '../../../../DigitalStageLogo';
import SettingsModal from '../../../../settings';
import MixingPanelModal from '../../../../MixingPanelModal';

const SideBar = (): JSX.Element => {
  const [selected, setSelected] = React.useState<string>();
  const [openSettings, setOpenSettings] = React.useState<boolean>(false);
  const [openMixer, setOpenMixer] = React.useState<boolean>(false);

  const SideBarItem = ({ item, index }: { item: NavItem; index: number }) => {
    return (
      <Box
        tabIndex={index}
        role="presentation"
        onClick={() => {
          if (item.href !== 'mixer' && item.href !== 'bug') {
            setSelected(item.href);
            setOpenSettings(true);
          } else if (item.href === 'bug') {
            window.open('https://forum.digital-stage.org/', '_target');
          } else if (item.href === 'mixer') {
            setOpenMixer(true);
          }
        }}
        sx={{
          color: 'gray.1',
          ':hover': { color: 'text' },
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
        <Link sx={{ color: 'text' }} href="https://www.digital-stage.org" target="_blank">
          <DigitalStageLogo single icon width={30} />
        </Link>
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
      <MixingPanelModal isOpen={openMixer} onClose={() => setOpenMixer(!openMixer)} />
    </Flex>
  );
};

export default SideBar;
