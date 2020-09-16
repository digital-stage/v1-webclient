import React, {useCallback, useEffect, useRef, useState} from "react";
import {useStages} from "../../lib/digitalstage/useStages";
import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader} from "baseui/modal";
import {useRequest} from "../../lib/useRequest";
import {useDevices} from "../../lib/digitalstage/useDevices";
import {Input} from "baseui/input";
import {Errors} from "../../lib/digitalstage/common/errors";

const StageJoiner = () => {
    const {ready} = useDevices();
    const {stageId, groupId, password, setRequest} = useRequest();
    const {joinStage} = useStages();
    const [wrongPassword, setWrongPassword] = useState<boolean>();
    const [notFound, setNotFound] = useState<boolean>();
    const passwordRef = useRef<HTMLInputElement>();

    const retryJoiningStage = useCallback(() => {
        // Try to connect
        joinStage(stageId, groupId, password)
            .catch(error => {
                if (error === Errors.INVALID_PASSWORD) {
                    setWrongPassword(true);
                } else {
                    setNotFound(true);
                }
            });
    }, [stageId, groupId, password]);

    useEffect(() => {
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
                <ModalHeader>Bühne nicht gefunden</ModalHeader>
                <ModalFooter>
                    <ModalButton isSelected={true} onClick={() => setNotFound(false)}>Verstanden</ModalButton>
                </ModalFooter>
            </Modal>
            <Modal isOpen={wrongPassword} onClose={() => setWrongPassword(false)}>
                <ModalHeader>Falsches Passwort</ModalHeader>
                <ModalBody>
                    <Input inputRef={passwordRef} type="password"/>

                </ModalBody>
                <ModalFooter>
                    <ModalButton>Abbrechen</ModalButton>
                    <ModalButton isSelected={true} onClick={() => {
                        const password = passwordRef.current.value;
                        setRequest(stageId, groupId, password);
                    }}>Erneut versuchen</ModalButton>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default StageJoiner;