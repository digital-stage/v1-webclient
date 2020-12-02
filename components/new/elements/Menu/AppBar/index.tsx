/** @jsxRuntime classic */
/** @jsx jsx */
import { Fragment, useEffect, useRef, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { Box, Button, jsx } from 'theme-ui';
import SettingsModal from '../../../../settings';
import DropdownMenu from './DropdownMenu';

const AppBar = (): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>('');
  const node = useRef(null);

  const handleClick = (e) => {
    if (node && node.current.contains(e.target)) {
      setOpen(true);
      return;
    }
    setOpen(false);
  };

  const handleSelect = (selected) => {
    if (selected !== 'feedback') {
      setSelected(selected);
      setOpenSettings(true);
      setOpen(false);
    } else if (selected === 'feedback') {
      window.open('https://forum.digital-stage.org/c/deutsch/ds-web/30', '_target');
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClick);
      return () => {
        document.removeEventListener('mousedown', handleClick);
      };
    }
  }, [open]);

  return (
    <Fragment>
      <Box role="menu">
        <Button
          variant="circle"
          sx={{
            width: '32px',
            height: '32px',
            bg: 'text',
            color: 'gray.2',
          }}
          onClick={() => setOpen(!open)}
        >
          <FaUser />
        </Button>
      </Box>
      <div ref={node}>
        <DropdownMenu
          isOpen={open}
          onClose={() => setOpen(false)}
          onSelect={(selected) => handleSelect(selected)}
        />
      </div>
      <SettingsModal
        isOpen={openSettings}
        onClose={() => setOpenSettings(false)}
        selected={selected}
      />
    </Fragment>
  );
};
export default AppBar;
