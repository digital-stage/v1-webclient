/* eslint-disable react/destructuring-assignment */
/** @jsxRuntime classic */
/** @jsx jsx */
import { Flex, jsx, Text } from 'theme-ui';
import { DangerButton, TertiaryButton } from '../digitalstage-ui/elements/input/Button';
import Dialog from './ui/Dialog';
import { useIntl } from 'react-intl';

interface IProps {
  onClose(): void;

  isOpen: boolean;

  onConfirm(): void;
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm }: IProps): JSX.Element => {
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <Text sx={{ color: 'gray.7' }}>{f('confirmDelete')}</Text>
      <Flex sx={{ justifyContent: 'center', pt: 8 }}>
        <TertiaryButton onClick={onClose}>{f('cancel')}</TertiaryButton>
        <DangerButton onClick={onConfirm}>{f('delete')}</DangerButton>
      </Flex>
    </Dialog>
  );
};

export default ConfirmationModal;
