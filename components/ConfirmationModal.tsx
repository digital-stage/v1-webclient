/* eslint-disable react/destructuring-assignment */
/** @jsxRuntime classic */
/** @jsx jsx */
import { Button, Flex, jsx, Text } from 'theme-ui';
import Dialog from './ui/Dialog';

interface IProps {
  onClose(): void;
  isOpen: boolean;
  onConfirm(): void;
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm }: IProps): JSX.Element => (
  <Dialog isOpen={isOpen} onClose={onClose}>
    <Text sx={{ color: 'gray.7' }}>
      Bist Du sicher, dass die Daten dauerhaft gelöscht werden sollen?
    </Text>
    <Flex sx={{ justifyContent: 'center', pt: 8 }}>
      <Button variant="tertiary" sx={{ color: 'gray.5' }} onClick={onClose}>
        Abbrechen
      </Button>
      <Button variant="danger" onClick={onConfirm}>
        Löschen
      </Button>
    </Flex>
  </Dialog>
);

export default ConfirmationModal;
