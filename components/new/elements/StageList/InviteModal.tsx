import React, { useEffect, useState } from 'react';
import { Flex, Button, Text, Message } from 'theme-ui';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Checkbox } from 'baseui/checkbox';
import { Stage, Group } from '../../../../lib/digitalstage/common/model.client';
import Modal from '../Modal';
import InputField from '../../../InputField';

const InviteModal = (props: {
  stage: Stage;
  group: Group;
  isOpen?: boolean;
  onClose?: () => void;
  usePassword?: boolean;
}): JSX.Element => {
  const { stage, group, usePassword, isOpen, onClose } = props;
  const [includePassword, setIncludePassword] = useState<boolean>(false);
  const [link, setLink] = useState<string>();
  const [isCopied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setCopied(false);
    if (stage && group) {
      const port: string = window.location.port ? `:${window.location.port}` : '';
      let generatedLink = `${window.location.protocol}/${window.location.hostname}${port}/join/${stage._id}/${group._id}`;
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <Text variant="title">Leute einladen</Text>
      {isCopied && <Message variant="success">Link in der Zwischenablage!</Message>}
      {usePassword && stage.password && (
        <Checkbox
          checked={includePassword}
          onChange={(event) => setIncludePassword(event.currentTarget.checked)}
        >
          Füge Passwort mit an
        </Checkbox>
      )}
      <InputField type="text" id="link" name="link" label="Link" value={link} version="dark" />
      <Flex sx={{ justifyContent: 'space-between', py: 2 }}>
        <Button variant="black" onClick={onClose}>
          Schließen
        </Button>
        <CopyToClipboard
          text={link}
          onCopy={() => {
            setCopied(true);
          }}
        >
          <Button autoFocus>Kopiere Link</Button>
        </CopyToClipboard>
      </Flex>
    </Modal>
  );
};

export default InviteModal;