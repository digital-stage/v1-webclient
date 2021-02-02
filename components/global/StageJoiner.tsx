import React, { useCallback, useRef, useState } from 'react';
import { Button, Flex, Heading } from 'theme-ui';
import Input from '../../digitalstage-ui/extra/Input';
import useStageActions from '../../lib/use-digital-stage/useStageActions';
import { useSelector } from '../../lib/use-digital-stage/hooks';
import useStageJoiner from '../../lib/useStageJoiner';
import { LightDialog } from '../../digitalstage-ui/extra/Dialog';
import { useRouter } from 'next/router';

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
  const router = useRouter();

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
          router.push('/stage');
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
      <LightDialog open={notFound} onClose={() => setNotFound(false)}>
        <Heading variant="title">Bühne nicht gefunden</Heading>
        <Flex sx={{ justifyContent: 'flex-end', py: 2 }}>
          <Button onClick={() => setNotFound(false)}>Ok</Button>
        </Flex>
      </LightDialog>
      <LightDialog open={wrongPassword} onClose={() => clear()}>
        <Heading variant="title">
          {retries === 0 ? 'Passwort notwendig' : 'Falsches Passwort'}
        </Heading>
        <Input
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
      </LightDialog>
    </>
  );
};

export default StageJoiner;
