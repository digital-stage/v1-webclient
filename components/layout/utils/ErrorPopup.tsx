import Modal, {ModalBody} from "../../../../digitalstage-ui/extra/Modal";
import {Heading, Text} from "theme-ui";
import React from "react";
import {useErrors} from "../../../../lib/useErrors";

const ErrorPopup = (): JSX.Element => {
    const {errors, warnings, clear} = useErrors();
    if (warnings.length > 0 || errors.length > 0) {
        return (
            <Modal onClose={() => clear()}>
                <ModalBody>
                    <Heading variant="h1">Ooops...</Heading>
                    {errors && (
                        <React.Fragment>
                            <Heading variant="h3">Errors:</Heading>
                            {errors.map(error => <Text key={error.name}>error.message</Text>)}
                        </React.Fragment>
                    )}
                    {warnings && (
                        <React.Fragment>
                            <Heading variant="h3">Warnings:</Heading>
                            {warnings.map(warning => <Text key={warning.name}>warning.message</Text>)}
                        </React.Fragment>
                    )}
                </ModalBody>
            </Modal>
        )
    }

    return null;
}
export default ErrorPopup;