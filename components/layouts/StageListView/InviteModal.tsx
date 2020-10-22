import React, {useEffect, useRef, useState} from "react";
import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader} from "baseui/modal";
import CopyToClipboard from 'react-copy-to-clipboard';
import {Input} from "baseui/input";
import {Checkbox} from "baseui/checkbox";
import {Client} from "../../../lib/digitalstage/common/model.client";

const InviteModal = (props: {
    stage: Client.Stage;
    group: Client.Group;
    isOpen?: boolean;
    onClose?: () => any;
    usePassword?: boolean;
}) => {
    const [includePassword, setIncludePassword] = useState<boolean>(false);
    const [link, setLink] = useState<string>();
    const [isCopied, setCopied] = useState<boolean>(false);

    useEffect(() => {
        setCopied(false);
        if (props.stage && props.group) {
            const port: string = window.location.port ? ":" + window.location.port : "";
            let link: string = window.location.protocol + "//" + window.location.hostname + port + "/join/" + props.stage._id + "/" + props.group._id;
            if (props.usePassword && props.stage.password && includePassword) {
                link += "?password=" + props.stage.password;
            }
            setLink(link);
        }
    }, [props.stage, props.group, props.usePassword, includePassword]);

    if (!props.stage || !props.group) {
        return null;
    }

    return (
        <Modal
            isOpen={props.isOpen}
            onClose={props.onClose}
            unstable_ModalBackdropScroll={true}
        >
            <ModalHeader>
                Leute einladen
            </ModalHeader>
            <ModalBody>
                {props.usePassword && props.stage.password &&
                <Checkbox checked={includePassword} onChange={event => setIncludePassword(event.currentTarget.checked)}>
                    Füge Passwort mit an
                </Checkbox>}
                <Input type="text"
                       value={link}/>
                <CopyToClipboard text={link} onCopy={() => {
                    setCopied(true);
                }}>
                    <ModalButton autoFocus>{isCopied ? "Link in der Zwischenablage!" : "Kopiere Link"}</ModalButton>
                </CopyToClipboard>
            </ModalBody>
            <ModalFooter>
                <ModalButton onClick={props.onClose}>Schließen</ModalButton>
            </ModalFooter>
        </Modal>
    )
}

export default InviteModal;