/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Flex, Button } from 'theme-ui';

import {
  Modal,
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalHeader
} from 'baseui/modal';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { KIND } from 'baseui/button';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Accordion, Panel } from 'baseui/accordion';
import useStageActions from '../../../../lib/digitalstage/useStageActions';

const CreateStageSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Zu kurz')
    .max(100, 'Zu lang')
    .required('Wird benötigt'),
  password: Yup.string()
    .min(5, 'Zu kurz')
    .max(50, 'Zu lang'),
  width: Yup.number()
    .min(0.1)
    .max(1000),
  length: Yup.number()
    .min(0.1)
    .max(1000),
  height: Yup.number()
    .min(0.1)
    .max(1000),
  absorption: Yup.number()
    .min(0.1)
    .max(1),
  reflection: Yup.number()
    .min(0.1)
    .max(1)
});

const CreateStageModal = (props: { isOpen?: boolean; onClose?: () => any }) => {
  const { isOpen, onClose } = props;
  const { createStage } = useStageActions();
  const formik = useFormik({
    validateOnMount: true,
    initialValues: {
      name: '',
      password: '',
      width: 25,
      length: 13,
      height: 7.5,
      damping: 0.7,
      absorption: 0.6
    },
    validationSchema: CreateStageSchema,
    onSubmit: values => {
      createStage(
        values.name,
        values.password,
        values.width,
        values.length,
        values.height,
        values.damping,
        values.absorption
      );
      props.onClose();
    }
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeable
      unstable_ModalBackdropScroll
    >
      <form onSubmit={formik.handleSubmit}>
        <ModalHeader>Neue Bühne erstellen</ModalHeader>
        <ModalBody>
          <FormControl
            label={() => 'Name'}
            caption={() => 'Gib der Bühne einen aussagekräftigen Namen'}
            error={formik.errors.name}
          >
            <Input
              required
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </FormControl>
          <FormControl
            label={() => 'Passwort'}
            caption={() => 'Optional: Verwende ein Zugangspasswort'}
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

          {/** 
          <Accordion>
            <Panel title="Erweiterte Einstellungen">
              <FormControl
                label={() => 'Breite'}
                caption={() => 'Breite der Bühne'}
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
                label={() => 'Länge'}
                caption={() => 'Länge der Bühne'}
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
                label={() => 'Höhe'}
                caption={() => 'Höhe der Bühne'}
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
                label={() => 'Absorption'}
                caption={() => 'Dämpfungsfaktor der Bühnenwände'}
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
                label={() => 'Absorption'}
                caption={() => 'Absorption der Bühnenwände'}
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
          */}
        </ModalBody>
        <ModalFooter>
          <ModalButton type="button" kind={KIND.tertiary} onClick={onClose}>
            Abbrechen
          </ModalButton>
          <ModalButton disabled={!formik.isValid} type="submit">
            Erstellen
          </ModalButton>
        </ModalFooter>
      </form>
    </Modal>
  );
};
export default CreateStageModal;
