import React, { useEffect, useState } from 'react';
import {
  Modal, ModalBody, ModalButton, ModalFooter, ModalHeader,
} from 'baseui/modal';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Input } from 'baseui/input';
import { Checkbox } from 'baseui/checkbox';
import { Client } from '../../../../lib/digitalstage/common/model.client';

const InviteModal = (props: {
  stage: Client.Stage;
  group: Client.Group;
  isOpen?: boolean;
  onClose?: () => any;
  usePassword?: boolean;
}) => {
  const {
    stage, group, usePassword, isOpen, onClose,
  } = props;
  const [includePassword, setIncludePassword] = useState<boolean>(false);
  const [link, setLink] = useState<string>();
  const [isCopied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setCopied(false);
    if (stage && group) {
      const port: string = window.location.port ? `:${window.location.port}` : '';
      let generatedLink: string = `${window.location.protocol}//${window.location.hostname}${port}/join/${stage._id}/${group._id}`;
      if (usePassword && stage.password && includePassword) {
        generatedLink += `?password=${stage.password}`;
      }
      setLink(generatedLink);
    }
  }, [stage, group, usePassword, includePassword]);

  if (!stage || !group) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      unstable_ModalBackdropScroll
    >
      <ModalHeader>
        Leute einladen
      </ModalHeader>
      <ModalBody>
        {usePassword && stage.password
                && (
                <Checkbox
                  checked={includePassword}
                  onChange={(event) => setIncludePassword(event.currentTarget.checked)}
                >
                  Füge Passwort mit an
                </Checkbox>
                )}
        <Input
          type="text"
          value={link}
        />
        <CopyToClipboard
          text={link}
          onCopy={() => {
            setCopied(true);
          }}
        >
          <ModalButton autoFocus>{isCopied ? 'Link in der Zwischenablage!' : 'Kopiere Link'}</ModalButton>
        </CopyToClipboard>
      </ModalBody>
      <ModalFooter>
        <ModalButton onClick={onClose}>Schließen</ModalButton>
      </ModalFooter>
    </Modal>
  );
};

export default InviteModal;
