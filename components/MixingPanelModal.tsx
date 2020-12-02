/** @jsxRuntime classic */
/** @jsx jsx */
import { Box, Heading, jsx, Text } from 'theme-ui';
import { useIsStageAdmin } from '../lib/use-digital-stage/hooks';
import MixingPanel from './mixer/MixingPanel';
import Modal from './new/elements/Modal';

interface IProps {
  isOpen: boolean;
  onClose(): void;
}

const MixingPanelModal = ({ isOpen, onClose }: IProps): JSX.Element => {
  const isAdmin = useIsStageAdmin();

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="dark" type="settings">
      <Box
        sx={{
          overflowX: 'auto',
          '::-webkit-scrollbar': {
            height: '16px',
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
          <Heading>Master Audiomixer</Heading>
          {isAdmin ? (
            <Text>
              Deine Mixereinstellungen werden für alle Nutzer in dieser Bühne verwendet und
              synchronisiert.
            </Text>
          ) : undefined}
        </Box>
        <Box sx={{ px: '1rem' }}>
          <MixingPanel />
        </Box>
      </Box>
    </Modal>
  );
};

export default MixingPanelModal;
