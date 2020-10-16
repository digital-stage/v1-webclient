import * as Yup from "yup";
import {useFormik} from "formik";
import React from "react";
import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader} from "baseui/modal";
import {Input} from "baseui/input";
import {FormControl} from "baseui/form-control";
import {KIND} from "baseui/button";
import {Client} from "../../../lib/digitalstage/common/model.client";
import useStageActions from "../../../lib/digitalstage/useStageActions";

const Schema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Zu kurz')
        .max(100, 'Zu lang')
        .required('Wird benötigt')
});

const CreateGroupModal = (props: {
    stage: Client.Stage;
    isOpen?: boolean;
    onClose?: () => any;

}) => {
    const {createGroup} = useStageActions();
    const formik = useFormik({
        validateOnMount: true,
        initialValues: {
            name: ''
        },
        validationSchema: Schema,
        onSubmit: (values) => {
            createGroup(props.stage._id, values.name);
            // Close modal
            props.onClose();
        },
    });

    return (
        <Modal
            closeable
            isOpen={props.isOpen}
            onClose={props.onClose}
            unstable_ModalBackdropScroll={true}
        >
            <form onSubmit={formik.handleSubmit}>
                <ModalHeader>Neue Gruppe erstellen</ModalHeader>
                <ModalBody>
                    <FormControl
                        label={() => "Name"}
                        caption={() => "Gib der Gruppe einen aussagekräftigen Namen"}
                        error={formik.errors.name}
                    >
                        <Input
                            required={true}
                            type="text"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <ModalButton type="button" kind={KIND.tertiary} onClick={props.onClose}>Abbrechen</ModalButton>
                    <ModalButton
                        disabled={!formik.isValid}
                        type="submit"
                    >Gruppe erstellen</ModalButton>
                </ModalFooter>
            </form>
        </Modal>
    )
}

export default CreateGroupModal;