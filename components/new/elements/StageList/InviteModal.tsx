import React, { useEffect, useState } from 'react';
import { Flex, Button, Heading, Message, Checkbox, Label } from 'theme-ui';
import CopyToClipboard from 'react-copy-to-clipboard';
import Modal from '../Modal';
import InputField from '../../../InputField';
import { Group, Stage } from '../../../../lib/use-digital-stage/types';

const InviteModal = (props: {
  stage: Stage;
  group: Group;
  isOpen?: boolean;
  onClose?: () => void;
}): JSX.Element => {
  const { stage, group, isOpen, onClose } = props;
  const [includePassword, setIncludePassword] = useState<boolean>(false);
  const [link, setLink] = useState<string>();
  const [isCopied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setCopied(false);
    if (stage && group) {
      const port: string = window.location.port ? `:${window.location.port}` : '';
      let generatedLink = `${window.location.protocol}/${window.location.hostname}${port}/join/${stage._id}/${group._id}`;
      if (stage.password && includePassword) {
        generatedLink += `?password=${stage.password}`;
      }
      setLink(generatedLink);
    }
  }, [stage, group, includePassword]);

  if (!stage || !group) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Heading variant="title">Teilnehmer einladen</Heading>
      {isCopied && <Message variant="success">Link in die Zwischenablage kopiert!</Message>}

      <InputField type="text" id="link" name="link" label="Link" value={link} version="dark" />
      {stage.password && (
        <Label sx={{ color: 'background', mt: 3 }}>
          <Checkbox
            checked={includePassword}
            onChange={(e) => setIncludePassword(e.currentTarget.checked)}
          />
          Link mit einem Passwort versehen
        </Label>
      )}
      <Flex sx={{ justifyContent: 'space-between', py: 3 }}>
        <Button variant="tertiary" sx={{ color: 'gray.5' }} onClick={onClose}>
          Schließen
        </Button>
        <CopyToClipboard
          text={link}
          onCopy={() => {
            setCopied(true);
          }}
        >
          <Button autoFocus>Link kopieren</Button>
        </CopyToClipboard>
      </Flex>
    </Modal>
  );
};

export default InviteModal;
