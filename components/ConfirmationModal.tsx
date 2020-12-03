/* eslint-disable react/destructuring-assignment */
/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Text, Button, Flex } from 'theme-ui';
import Modal from './new/elements/Modal';

interface Props {
  onClose(): void;
  isOpen: boolean;
  onConfirm(): void;
}

const ConfirmationModal = (props: Props): JSX.Element => (
  <Modal isOpen={props.isOpen} onClose={props.onClose}>
    <Text sx={{ color: 'gray.7' }}>Are you sure you want to delete?</Text>
    <Flex sx={{ justifyContent: 'flex-end' }}>
      <Button variant="black" onClick={props.onClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={props.onConfirm}>
        Delete
      </Button>
    </Flex>
  </Modal>
);

export default ConfirmationModal;
