/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui';
import MixingPanelView from './new/elements/MixingPanel';
import Modal from './new/elements/Modal';

interface Props {
  isOpen: boolean;
  onClose(): void;
}

const MixingPanelModal = ({ isOpen, onClose }: Props): JSX.Element => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="dark" type="settings">
      <MixingPanelView />
    </Modal>
  );
};

export default MixingPanelModal;
