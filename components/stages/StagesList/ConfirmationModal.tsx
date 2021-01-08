/* eslint-disable react/destructuring-assignment */
/** @jsxRuntime classic */
/** @jsx jsx */
import { Flex, jsx, Text } from 'theme-ui';
import { DangerButton, TertiaryButton } from '../../../digitalstage-ui/elements/input/Button';
import { useIntl } from 'react-intl';
import { LightDialog } from '../../../digitalstage-ui/elements/surface/Dialog';

interface IProps {
  onClose(): void;

  isOpen: boolean;

  onConfirm(): void;
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm }: IProps): JSX.Element => {
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });

  return (
    <LightDialog size="dialog" closable open={isOpen} onClose={onClose}>
      <Text sx={{ color: 'gray.7' }}>{f('confirmDelete')}</Text>
      <Flex sx={{ justifyContent: 'center', pt: 8 }}>
        <TertiaryButton onClick={onClose}>{f('cancel')}</TertiaryButton>
        <DangerButton onClick={onConfirm}>{f('delete')}</DangerButton>
      </Flex>
    </LightDialog>
  );
};

export default ConfirmationModal;
