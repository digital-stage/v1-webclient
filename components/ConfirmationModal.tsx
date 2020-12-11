/* eslint-disable react/destructuring-assignment */
/** @jsxRuntime classic */
/** @jsx jsx */
import { Button, Flex, jsx, Text } from 'theme-ui';
import Modal from './new/elements/Modal';

interface IProps {
  onClose(): void;
  isOpen: boolean;
  onConfirm(): void;
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm }: IProps): JSX.Element => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <Text sx={{ color: 'gray.7' }}>
      Bist Du sicher, dass die Daten dauerhaft gelöscht werden sollen?
    </Text>
    <Flex sx={{ justifyContent: 'flex-end' }}>
      <Button variant="tertiary" sx={{ color: 'gray.5' }} onClick={onClose}>
        Abbrechen
      </Button>
      <Button variant="danger" onClick={onConfirm}>
        Löschen
      </Button>
    </Flex>
  </Modal>
);

export default ConfirmationModal;
