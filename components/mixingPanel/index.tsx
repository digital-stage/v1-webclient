/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui';
import Modal from '../new/elements/Modal';
import AllGroupsMixers from './AllGroupsMixers';

interface Props {
  isOpen: boolean;
  onClose(): void;
}

const MixingPanelModal = ({ isOpen, onClose }: Props): JSX.Element => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="dark" type="settings">
      <AllGroupsMixers />
    </Modal>
  );
};

export default MixingPanelModal;
