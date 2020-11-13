import React, { useCallback, useRef, useState } from 'react';
import { Heading, Button, Flex } from 'theme-ui';
import { useRequest } from '../../../lib/useRequest';
import { Errors } from '../../../lib/digitalstage/common/errors';
import useStageActions from '../../../lib/digitalstage/useStageActions';
import useStageSelector from '../../../lib/digitalstage/useStageSelector';
import Modal from './Modal';
import InputField from '../../InputField';

/**
 * The StageJoiner is a usually hidden component,
 * that reacts to requested stage joins and displays errors if occuring
 *
 * //TODO: Replace modal with own digital stage components
 * @constructor
 */
const StageJoiner = (): JSX.Element => {
  const { ready } = useStageSelector((state) => ({
    ready: state.ready,
  }));
  const { stageId, groupId, password, setRequest } = useRequest();
  const { joinStage } = useStageActions();
  const [retries, setRetries] = useState<number>(0);
  const [wrongPassword, setWrongPassword] = useState<boolean>();
  const [notFound, setNotFound] = useState<boolean>();
  const passwordRef = useRef<HTMLInputElement>();

  const retryJoiningStage = useCallback(() => {
    // Try to connect
    joinStage(stageId, groupId, password)
      .catch((error) => {
        console.error(error);
        if (error === Errors.INVALID_PASSWORD) {
          setWrongPassword(true);
        } else {
          setNotFound(true);
        }
      })
      .then(() => {
        // do nothing.
      });
  }, [joinStage, stageId, groupId, password]);

  React.useEffect(() => {
    if (ready) {
      if (stageId && groupId) {
        setNotFound(false);
        setWrongPassword(false);
        retryJoiningStage();
      }
    }
  }, [ready, stageId, groupId, password]);

  return (
    <>
      <Modal isOpen={notFound} onClose={() => setNotFound(false)}>
        <Heading variant="title">Bühne nicht gefunden</Heading>
        <Flex sx={{ justifyContent: 'flex-end', py: 2 }}>
          <Button onClick={() => setNotFound(false)}>
            Verstanden
          </Button>
        </Flex>
      </Modal>
      <Modal
        isOpen={wrongPassword}
        onClose={() => setWrongPassword(false)}
      >
        <Heading variant="title">{retries === 0 ? 'Passwort notwendig' : 'Falsches Passwort'}</Heading>
        <InputField
          id="password"
          label="Password"
          name="password"
          inputRef={passwordRef}
          type="password"
        />
        <Flex sx={{ justifyContent: 'space-between', py: 2 }}>
          <Button onClick={() => setWrongPassword(false)}>Abbrechen</Button>
          <Button
            onClick={() => {
              const updatePassword = passwordRef.current.value;
              setRetries((prevState) => prevState + 1);
              setRequest(stageId, groupId, updatePassword);
            }}
          >
            Erneut versuchen
          </Button>
        </Flex>
      </Modal>
    </>
  );
};

export default StageJoiner;
