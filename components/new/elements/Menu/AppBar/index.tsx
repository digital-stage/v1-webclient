/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Button } from 'theme-ui';
import { FaUser } from 'react-icons/fa';
import DropdownMenu from './DropdownMenu';

const AppBar = (): JSX.Element => {
  const [open, setOpen] = React.useState<boolean>(false);

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
      <DropdownMenu isOpen={open} onClose={() => setOpen(false)} />
    </React.Fragment>
  );
};
export default AppBar;
