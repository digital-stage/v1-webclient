/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Button } from 'theme-ui';
import { FaUser } from 'react-icons/fa';
import Modal from '../../Modal';
import NavItem from '../NavItem';
import {
  CenteredNavItems,
  LowerNavItems,
  UpperNavItems,
} from '../../PageWrapperWithStage/MenuItems';

const combinedMenu = [...UpperNavItems, ...CenteredNavItems, ...LowerNavItems];

const AppBar = (props: { onSelected: (navItem: NavItem) => void }): JSX.Element => {
  const { onSelected } = props;

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
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        {combinedMenu &&
          combinedMenu.map((item, index) => {
            return (
              <Box
                key={index}
                tabIndex={index}
                role="presentation"
                onClick={() => {
                  setOpen(false);
                  onSelected(item);
                }}
                sx={{ color: 'background' }}
              >
                {item.label}
              </Box>
            );
          })}
      </Modal>
    </React.Fragment>
  );
};
export default AppBar;
