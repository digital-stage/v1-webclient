import * as Yup from "yup";
import {useFormik} from "formik";
import React, {useEffect} from "react";
import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader} from "baseui/modal/index";
import {Input} from "baseui/input/index";
import {FormControl} from "baseui/form-control/index";
import {KIND} from "baseui/button/index";
import {Client} from "../../../lib/digitalstage/common/model.client";
import useStageActions from "../../../lib/digitalstage/useStageActions";

const Schema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Zu kurz')
        .max(100, 'Zu lang')
        .required('Wird benötigt')
});

const ModifyGroupModal = (props: {
    group: Client.Group;
    isOpen?: boolean;
    onClose?: () => any;

}) => {
    const {updateGroup} = useStageActions();
    const formik = useFormik({
        validateOnMount: true,
        initialValues: {
            name: props.group ? props.group.name : ''
        },
        validationSchema: Schema,
        onSubmit: (values) => {
            updateGroup(props.group._id, {
                name: values.name
            });
            // Close modal
            props.onClose();
        },
    });

    useEffect(() => {
        if (props.group)
            formik.setValues({name: props.group.name})
    }, [props.group])

    return (
        <Modal
            closeable
            isOpen={props.isOpen}
            onClose={props.onClose}
            unstable_ModalBackdropScroll={true}
        >
            <form onSubmit={formik.handleSubmit}>
                <ModalHeader>Gruppe ändern</ModalHeader>
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
                    <ModalButton kind={KIND.tertiary} onClick={props.onClose}>Abbrechen</ModalButton>
                    <ModalButton
                        disabled={!formik.isValid}
                        type="submit"
                    >Gruppe erstellen</ModalButton>
                </ModalFooter>
            </form>
        </Modal>
    )
}

export default ModifyGroupModal;