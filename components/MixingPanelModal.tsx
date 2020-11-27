/** @jsxRuntime classic */
/** @jsx jsx */
import { Box, Heading, jsx, Text } from 'theme-ui';
import Modal from './new/elements/Modal';
import { useIsStageAdmin } from '../lib/use-digital-stage/hooks';
import MixingPanel from './mixer/MixingPanel';
interface Props {
  isOpen: boolean;
  onClose(): void;
}

const MixingPanelModal = ({ isOpen, onClose }: Props): JSX.Element => {
  const isAdmin = useIsStageAdmin();

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
          {isAdmin ? (
            <Text>
              As admin you mixer settings will be send and synchronised with all users in your stage
            </Text>
          ) : undefined}
        </Box>
        <MixingPanel />
      </Box>
    </Modal>
  );
};

export default MixingPanelModal;
