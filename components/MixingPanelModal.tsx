/** @jsxRuntime classic */
/** @jsx jsx */
import { Box, jsx } from 'theme-ui';
import MixingPanelView from './new/elements/MixingPanel';
import Modal from './new/elements/Modal';

interface Props {
  isOpen: boolean;
  onClose(): void;
}

const MixingPanelModal = ({ isOpen, onClose }: Props): JSX.Element => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="dark" type="settings">
      <Box
        sx={{
          overflowX: 'auto',
          '::-webkit-scrollbar': {
            height: '7px',
            mt: 2,
          },
          '::-webkit-scrollbar-track': {
            bg: 'transparent',
          },
          '::-webkit-scrollbar-thumb': {
            bg: 'gray.3',
            borderRadius: 'card',
          },
          '::-webkit-scrollbar-thumb:hover': {
            bg: 'gray.5',
          },
        }}
      >
        <MixingPanelView />
      </Box>
    </Modal>
  );
};

export default MixingPanelModal;
