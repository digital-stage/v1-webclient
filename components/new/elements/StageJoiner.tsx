import React, { useCallback, useRef, useState } from 'react';
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader } from 'baseui/modal';
import { Input } from 'baseui/input';
import { useRequest } from '../../../lib/useRequest';
import { Errors } from '../../../lib/digitalstage/common/errors';
import useStageActions from '../../../lib/digitalstage/useStageActions';
import useStageSelector from '../../../lib/digitalstage/useStageSelector';

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
      <Modal isOpen={notFound} onClose={() => setNotFound(false)} unstable_ModalBackdropScroll>
        <ModalHeader>Bühne nicht gefunden</ModalHeader>
        <ModalFooter>
          <ModalButton isSelected onClick={() => setNotFound(false)}>
            Verstanden
          </ModalButton>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={wrongPassword}
        onClose={() => setWrongPassword(false)}
        unstable_ModalBackdropScroll
      >
        <ModalHeader>{retries === 0 ? 'Passwort notwendig' : 'Falsches Passwort'}</ModalHeader>
        <ModalBody>
          <Input inputRef={passwordRef} type="password" />
        </ModalBody>
        <ModalFooter>
          <ModalButton onClick={() => setWrongPassword(false)}>Abbrechen</ModalButton>
          <ModalButton
            isSelected
            onClick={() => {
              const updatePassword = passwordRef.current.value;
              setRetries((prevState) => prevState + 1);
              setRequest(stageId, groupId, updatePassword);
            }}
          >
            Erneut versuchen
          </ModalButton>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default StageJoiner;
