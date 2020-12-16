import React, { useCallback, useRef, useState } from 'react';
import { Button, Flex, Heading } from 'theme-ui';
import InputField from '../ui/InputField';
import Dialog from '../ui/Dialog';
import useStageActions from '../../lib/use-digital-stage/useStageActions';
import { useSelector } from '../../lib/use-digital-stage/hooks';
import useStageJoiner from '../../lib/useStageJoiner';

/**
 * The StageJoiner is a usually hidden component,
 * that reacts to requested stage joins and displays errors if occuring
 *
 * //TODO: Replace modal with own digital stage components
 * @constructor
 */
const StageJoiner = (): JSX.Element => {
  const ready = useSelector((state) => state.global.ready);
  const { stageId, groupId, password, reset } = useStageJoiner();
  const stageActions = useStageActions();
  const [retries, setRetries] = useState<number>(0);
  const [wrongPassword, setWrongPassword] = useState<boolean>();
  const [notFound, setNotFound] = useState<boolean>();
  const [intPassword, setIntPassword] = useState<string>(password);
  const passwordRef = useRef<HTMLInputElement>();

  const clear = useCallback(() => {
    setNotFound(false);
    setWrongPassword(false);
    setRetries(0);
    reset();
  }, [reset]);

  const retryJoiningStage = useCallback(
    (stageId: string, groupId: string, password?: string) => {
      // Try to connect
      console.log('Try to join ', stageId, groupId, password);
      stageActions
        .joinStage(stageId, groupId, password)
        .then(() => {
          console.log('JOINED');
          clear();
        })
        .catch((error) => {
          if (error === 'Invalid password') {
            setWrongPassword(true);
          } else {
            setNotFound(true);
          }
        });
    },
    [stageActions, clear]
  );

  React.useEffect(() => {
    if (ready && stageActions) {
      if (stageId && groupId) {
        setNotFound(false);
        setWrongPassword(false);
        retryJoiningStage(stageId, groupId, password);
      }
    }
  }, [ready, stageId, groupId, password, stageActions]);

  const updatePassword = useCallback(() => {
    if (passwordRef.current) {
      console.log('UPDATE PASSWORD');
      retryJoiningStage(stageId, groupId, passwordRef.current.value);
    }
    console.log('! PASSWORD');
  }, [stageId, groupId, retryJoiningStage, passwordRef]);

  return (
    <>
      <Dialog isOpen={notFound} onClose={() => setNotFound(false)}>
        <Heading variant="title">Bühne nicht gefunden</Heading>
        <Flex sx={{ justifyContent: 'flex-end', py: 2 }}>
          <Button onClick={() => setNotFound(false)}>Ok</Button>
        </Flex>
      </Dialog>
      <Dialog isOpen={wrongPassword} onClose={() => clear()}>
        <Heading variant="title">
          {retries === 0 ? 'Passwort notwendig' : 'Falsches Passwort'}
        </Heading>
        <InputField
          id="password"
          label="Password"
          name="password"
          onChange={(e) => setIntPassword(e.currentTarget.value)}
          ref={passwordRef}
          type="password"
          version="dark"
        />
        <Flex sx={{ justifyContent: 'space-between', py: 2 }}>
          <Button onClick={() => clear()}>Abbrechen</Button>
          <Button
            onClick={() => {
              setRetries((prev) => prev + 1);
              retryJoiningStage(stageId, groupId, intPassword);
            }}
          >
            Erneut versuchen
          </Button>
        </Flex>
      </Dialog>
    </>
  );
};

export default StageJoiner;
