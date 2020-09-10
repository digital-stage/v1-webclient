import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader} from "baseui/modal/index";
import {FormControl} from "baseui/form-control/index";
import {Input} from "baseui/input/index";
import React from "react";
import {KIND} from "baseui/button/index";
import * as Yup from "yup";
import {useFormik} from "formik";
import {useStages} from "../lib/useStages";

const Schema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Zu kurz')
        .max(100, 'Zu lang')
        .required('Wird benötigt'),
    password: Yup.string()
        .min(5, 'Zu kurz')
        .max(50, 'Zu lang')
});

const CreateStageModal = (props: {
    isOpen?: boolean;
    onClose?: () => any;
}) => {
    const {createStage} = useStages();
    const formik = useFormik({
        validateOnMount: true,
        initialValues: {
            name: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: Schema,
        onSubmit: (values) => {
            console.log("Submitting");
            createStage(values.name, values.password);
            // Close modal
            props.onClose();
            console.log("Finished submitting");
        },
    });

    return (
        <Modal
            isOpen={props.isOpen}
            onClose={props.onClose}
            closeable={true}
            unstable_ModalBackdropScroll={true}
        >
            <form onSubmit={formik.handleSubmit}>
                <ModalHeader>Neue Bühne erstellen</ModalHeader>
                <ModalBody>
                    <FormControl
                        label={() => "Name"}
                        caption={() => "Gib der Bühne einen aussagekräftigen Namen"}
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
                    <FormControl
                        label={() => "Passwort"}
                        caption={() => "Optional: Verwende ein Zugangspasswort"}
                        error={formik.errors.password}
                    >
                        <Input
                            type="text"
                            name="password"
                            required={false}
                            value={formik.values.password}
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
                    >Erstellen</ModalButton>
                </ModalFooter>
            </form>
        </Modal>
    )
}
export default CreateStageModal