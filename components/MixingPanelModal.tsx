/** @jsxRuntime classic */
/** @jsx jsx */
import { Box, Flex, Heading, jsx, Text } from 'theme-ui';
import { useIsStageAdmin } from '../lib/use-digital-stage/hooks';
import MixingPanel from './mixer/MixingPanel';
import Modal from './ui/Modal';
import React from 'react';

interface IProps {
  isOpen: boolean;

  onClose(): void;
}

const MixingPanelModal = ({ isOpen, onClose }: IProps): JSX.Element => {
  const isAdmin = useIsStageAdmin();

  return (
    <Modal open={isOpen} onClose={onClose} closeOnBackdropClicked={true}>
      <Flex
        sx={{
          flexDirection: 'column',
          width: '100%',
          height: '100%',
        }}
      >
        <Heading mb={5}>Master Audiomixer</Heading>
        {isAdmin ? (
          <Text mb={5}>
            Deine Mixereinstellungen werden für alle Nutzer in dieser Bühne verwendet und
            synchronisiert.
          </Text>
        ) : undefined}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            flexGrow: 1,
            overflowY: 'scroll',
            '::-webkit-scrollbar': {
              width: '5px',
              bg: 'transparent',
            },
            '::-webkit-scrollbar-track': {
              bg: 'transparent',
            },
            '::-webkit-scrollbar-thumb': {
              bg: 'gray.3',
              borderRadius: 'card',
            },
          }}
        >
          <MixingPanel />
        </Box>
      </Flex>
    </Modal>
  );
};

export default MixingPanelModal;
