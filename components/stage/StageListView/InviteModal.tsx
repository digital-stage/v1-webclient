import React, {useEffect, useState} from "react";
import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader} from "baseui/modal";
import CopyToClipboard from 'react-copy-to-clipboard';
import {Input} from "baseui/input";
import {Group, Stage} from "../../../lib/digitalstage/common/model.client";
import {Button} from "baseui/button";

const InviteModal = (props: {
    stage: Stage;
    group: Group;
    isOpen?: boolean;
    onClose?: () => any;
}) => {
    const [link, setLink] = useState<string>();
    const [isCopied, setCopied] = useState<boolean>(false);

    useEffect(() => {
        setCopied(false);
        if (props.stage && props.group) {
            setLink(window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/join/" + props.stage._id + "/" + props.group._id);
        }
    }, [props.stage, props.group]);

    if (!props.stage || !props.group) {
        return null;
    }

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <ModalHeader>
                Leute einladen
            </ModalHeader>
            <ModalBody>
                <Input type="text"
                       value={link}/>
                <CopyToClipboard text={link} onCopy={() => setCopied(true)}>
                    <Button>{isCopied ? "Link in der Zwischenablage!" : "Kopiere Link"}</Button>
                </CopyToClipboard>
            </ModalBody>
            <ModalFooter>
                <ModalButton onClick={props.onClose}>Schließen</ModalButton>
            </ModalFooter>
        </Modal>
    )
}

export default InviteModal;