import React, { useEffect, useState } from 'react';
import { Flex, Button, Heading, Message, Checkbox, Label, jsx } from 'theme-ui';
import CopyToClipboard from 'react-copy-to-clipboard';
import Input from '../../../digitalstage-ui/extra/Input';
import { Group, Stage } from '../../../lib/use-digital-stage/types';
import { LightDialog } from '../../../digitalstage-ui/extra/Dialog';

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
    <LightDialog size="dialog" closable open={isOpen} onClose={onClose}>
      <Heading variant="title" pb={5}>
        Teilnehmer einladen
      </Heading>
      {isCopied && <Message variant="success">Link in die Zwischenablage kopiert!</Message>}

      <Input type="text" id="link" name="link" label="Link" value={link} version="dark" />
      {stage.password && (
        <Label sx={{ color: 'background', mt: 3 }}>
          <Checkbox
            checked={includePassword}
            onChange={(e) => setIncludePassword(e.currentTarget.checked)}
          />
          Link mit einem Passwort versehen
        </Label>
      )}
      <Flex sx={{ justifyContent: 'center', pt: 7 }}>
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
    </LightDialog>
  );
};

export default InviteModal;
