/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Button } from 'theme-ui';
import { FaUser } from 'react-icons/fa';
import DropdownMenu from './DropdownMenu';
import SettingsModal from '../../../../settings';

const AppBar = (): JSX.Element => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [openSettings, setOpenSettings] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<string>('');
  const node = React.useRef(null);

  const handleClick = (e) => {
    if (node && node.current.contains(e.target)) {
      setOpen(true);
      return;
    }
    setOpen(false);
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return (
    <React.Fragment>
      <Box role="menu">
        <Button
          variant="circle"
          sx={{
            width: '32px',
            height: '32px',
            bg: 'text',
            color: 'gray.2',
          }}
          onClick={() => setOpen((prev) => !prev)}
        >
          <FaUser />
        </Button>
      </Box>
      <div ref={node}>
        <DropdownMenu
          isOpen={open}
          onClose={() => setOpen(false)}
          onSelect={(selected) => {
            if (selected !== 'feedback') {
              setSelected(selected);
              setOpenSettings(true);
              setOpen(false);
            } else if (selected === 'feedback') {
              window.open('https://forum.digital-stage.org/', '_target');
            }
          }}
        />
      </div>
      <SettingsModal
        isOpen={openSettings}
        onClose={() => setOpenSettings(false)}
        selected={selected}
      />
    </React.Fragment>
  );
};
export default AppBar;
