/** @jsxRuntime classic */
/** @jsx jsx */
import { Box, Heading, jsx, Text } from 'theme-ui';
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
            height: '15px',
            mt: 2,
          },
          '::-webkit-scrollbar-track': {
            bg: 'transparent',
          },
          '::-webkit-scrollbar-thumb': {
            bg: 'gray.3',
            borderRadius: 'card',
            border: 'solid 3px #282828',
          },
        }}
      >
        <Box sx={{ my: 3, ml: 3 }}>
          <Heading>Master audio mixer</Heading>
          {/* <Text>As admin you mixer settings will be send and synchronised with all users in your stage</Text> */}
        </Box>
        <MixingPanelView />
      </Box>
    </Modal>
  );
};

export default MixingPanelModal;
