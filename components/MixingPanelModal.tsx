/** @jsxRuntime classic */
/** @jsx jsx */
import { Box, Flex, Heading, jsx, Text } from 'theme-ui';
import { useIsStageAdmin } from '../lib/use-digital-stage/hooks';
import MixingPanel from './mixer/MixingPanel';
import React from 'react';
import Modal from '../digitalstage-ui/elements/surface/Modal';

interface IProps {
  isOpen: boolean;

  onClose(): void;
}

const MixingPanelModal = ({ isOpen, onClose }: IProps): JSX.Element => {
  const isAdmin = useIsStageAdmin();
  const [globalMode, setGlobalMode] = React.useState<boolean>(!isAdmin);

  return (
    <Modal open={isOpen} onClose={onClose} closable={true} size="full">
      <Flex
        sx={{
          flexDirection: 'column',
          width: '100%',
          height: '100%',
        }}
      >
        <Flex mb={5}>
          <Heading
            variant="tab"
            sx={{
              mr: 5,
              color: !globalMode && 'text',
              borderColor: !globalMode && 'primary',
              cursor: 'pointer',
            }}
            onClick={() => setGlobalMode(false)}
          >
            Personal
          </Heading>
          <Heading
            variant="tab"
            sx={{
              mr: 5,
              color: globalMode && 'text',
              borderColor: globalMode && 'primary',
              cursor: 'pointer',
            }}
            onClick={() => setGlobalMode(true)}
          >
            Global
          </Heading>
        </Flex>
        {globalMode ? (
          isAdmin ? (
            <Text mb={5}>
              Deine Einstellungen werden für alle Nutzer in dieser Bühne verwendet und
              synchronisiert.
            </Text>
          ) : (
            <Text mb={5}>
              Deine Einstellungen werden vom Bühnen Besitzer gesteuert und synchronisiert.
            </Text>
          )
        ) : (
          <Text mb={5}>Deine Einstellungen gelten nur für Dich persönlich.</Text>
        )}
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
          <MixingPanel globalMode={globalMode} />
        </Box>
      </Flex>
    </Modal>
  );
};

export default MixingPanelModal;
