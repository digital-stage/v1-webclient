/* eslint-disable react/destructuring-assignment */
/** @jsxRuntime classic */
/** @jsx jsx */
import { Button, Flex, jsx, Text } from 'theme-ui';
import { useIntl } from 'react-intl';
import { LightDialog } from '../../../digitalstage-ui/extra/Dialog';

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
        <Button variant="tertiary" sx={{ color: 'gray.5' }} onClick={onClose}>
          {f('cancel')}
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {f('delete')}
        </Button>
      </Flex>
    </LightDialog>
  );
};

export default ConfirmationModal;
