import React, { useCallback, useRef, useState } from 'react';
import { Button, Flex, Heading } from 'theme-ui';
import InputField from '../../InputField';
import Modal from './Modal';
import useStageActions from '../../../lib/use-digital-stage/useStageActions';
import { useSelector } from '../../../lib/use-digital-stage/hooks';
import { Errors } from '../../../lib/useAuth';
import useStageJoiner from '../../../lib/useStageJoiner';

/**
 * The StageJoiner is a usually hidden component,
 * that reacts to requested stage joins and displays errors if occuring
 *
 * //TODO: Replace modal with own digital stage components
 * @constructor
 */
const StageJoiner = (): JSX.Element => {
  const ready = useSelector((state) => state.global.ready);
  const { stageId, groupId, password, requestJoin, reset } = useStageJoiner();
  const { joinStage } = useStageActions();
  const [retries, setRetries] = useState<number>(0);
  const [wrongPassword, setWrongPassword] = useState<boolean>();
  const [notFound, setNotFound] = useState<boolean>();
  const passwordRef = useRef<HTMLInputElement>(null);

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
        reset();
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
          <Button onClick={() => setNotFound(false)}>Ok</Button>
        </Flex>
      </Modal>
      <Modal isOpen={wrongPassword} onClose={() => setWrongPassword(false)}>
        <Heading variant="title">
          {retries === 0 ? 'Passwort notwendig' : 'Falsches Passwort'}
        </Heading>
        <InputField
          id="password"
          label="Password"
          name="password"
          ref={passwordRef}
          type="password"
        />
        <Flex sx={{ justifyContent: 'space-between', py: 2 }}>
          <Button onClick={() => setWrongPassword(false)}>Abbrechen</Button>
          <Button
            onClick={() => {
              const updatePassword = passwordRef.current.value;
              setRetries((prevState) => prevState + 1);
              requestJoin(stageId, groupId, updatePassword);
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
