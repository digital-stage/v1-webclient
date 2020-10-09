import * as Yup from "yup";
import {useFormik} from "formik";
import {useStages} from "../../../lib/digitalstage/useStageContext";
import React, {useEffect} from "react";
import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader} from "baseui/modal/index";
import {Input} from "baseui/input/index";
import {FormControl} from "baseui/form-control/index";
import {KIND} from "baseui/button/index";
import {Accordion, Panel} from "baseui/accordion/index";
import {Client} from "../../../lib/digitalstage/common/model.client";
import useStageActions from "../../../lib/digitalstage/useStageActions";

const Schema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Zu kurz')
        .max(100, 'Zu lang')
        .required('Wird benötigt'),
    password: Yup.string()
        .min(5, 'Zu kurz')
        .max(50, 'Zu lang'),
    width: Yup.number().min(0.1).max(1000),
    length: Yup.number().min(0.1).max(1000),
    height: Yup.number().min(0.1).max(1000),
    absorption: Yup.number().min(0.1).max(1),
    reflection: Yup.number().min(0.1).max(1),
});

const ModifyStageModal = (props: {
    stage: Client.Stage;
    isOpen?: boolean;
    onClose?: () => any;

}) => {
    const {updateStage} = useStageActions();
    const formik = useFormik({
        validateOnMount: true,
        initialValues: props.stage ? {
            name: props.stage.name,
            password: props.stage.password,
            width: props.stage.width,
            length: props.stage.length,
            height: props.stage.height,
            absorption: props.stage.absorption,
            damping: props.stage.damping
        } : {
            name: '',
            password: '',
            width: 25,
            length: 13,
            height: 7.5,
            damping: 0.7,
            absorption: 0.6
        },
        validationSchema: Schema,
        onSubmit: (values) => {
            updateStage(props.stage._id, {
                name: values.name,
                password: values.password,
                width: values.width,
                length: values.length,
                height: values.height,
                absorption: values.absorption,
                damping: values.damping
            });
            // Close modal
            props.onClose();
        },
    });

    useEffect(() => {
        if (props.stage)
            formik.setValues({
                name: props.stage.name,
                password: props.stage.password,
                width: props.stage.width,
                length: props.stage.length,
                height: props.stage.height,
                absorption: props.stage.absorption,
                damping: props.stage.damping
            })
    }, [props.stage])

    return (
        <Modal
            closeable
            isOpen={props.isOpen}
            onClose={props.onClose}
            unstable_ModalBackdropScroll={true}
        >
            <form onSubmit={formik.handleSubmit}>
                <ModalHeader>Bühne ändern</ModalHeader>
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

                    <Accordion>
                        <Panel title="Erweiterte Einstellungen">
                            <FormControl
                                label={() => "Breite"}
                                caption={() => "Breite der Bühne"}
                                error={formik.errors.width}
                            >
                                <Input
                                    type="number"
                                    name="width"
                                    required={false}
                                    value={formik.values.width}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </FormControl>
                            <FormControl
                                label={() => "Länge"}
                                caption={() => "Länge der Bühne"}
                                error={formik.errors.length}
                            >
                                <Input
                                    type="number"
                                    name="length"
                                    required={false}
                                    value={formik.values.length}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </FormControl>
                            <FormControl
                                label={() => "Höhe"}
                                caption={() => "Höhe der Bühne"}
                                error={formik.errors.height}
                            >
                                <Input
                                    type="number"
                                    name="height"
                                    required={false}
                                    value={formik.values.height}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </FormControl>
                            <FormControl
                                label={() => "Dämpfung"}
                                caption={() => "Dämpfungsfaktor der Bühnenwände"}
                                error={formik.errors.damping}
                            >
                                <Input
                                    type="number"
                                    name="reflection"
                                    required={false}
                                    value={formik.values.damping}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </FormControl>
                            <FormControl
                                label={() => "Absorption"}
                                caption={() => "Absorption der Bühnenwände"}
                                error={formik.errors.absorption}
                            >
                                <Input
                                    type="number"
                                    name="absorption"
                                    required={false}
                                    value={formik.values.absorption}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </FormControl>
                        </Panel>
                    </Accordion>
                </ModalBody>
                <ModalFooter>
                    <ModalButton kind={KIND.tertiary} onClick={props.onClose}>Abbrechen</ModalButton>
                    <ModalButton
                        disabled={!formik.isValid}
                        type="submit"
                    >Gruppe ändern</ModalButton>
                </ModalFooter>
            </form>
        </Modal>
    )
}

export default ModifyStageModal;