/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Flex, Button } from 'theme-ui';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Modal,
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalHeader
} from 'baseui/modal/index';
import { Input } from 'baseui/input/index';
import { FormControl } from 'baseui/form-control/index';
import { KIND } from 'baseui/button/index';
import { Client } from '../../../../lib/digitalstage/common/model.client';
import useStageActions from '../../../../lib/digitalstage/useStageActions';

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
  const { group, isOpen, onClose } = props;
  const { updateGroup } = useStageActions();
  const formik = useFormik({
    initialValues: {
      name: group ? group.name : ''
    },
    validationSchema: Schema,
    onSubmit: values => {
      updateGroup(group._id, {
        name: values.name
      });
      onClose();
    }
  });

  React.useEffect(() => {
    if (group) formik.setValues({ name: group.name });
  }, [group]);

  return (
    <Modal
      closeable
      isOpen={isOpen}
      onClose={onClose}
      unstable_ModalBackdropScroll
    >
      <form onSubmit={formik.handleSubmit}>
        <ModalHeader>Gruppe ändern</ModalHeader>
        <ModalBody>
          <FormControl
            label={() => 'Name'}
            caption={() => 'Gib der Gruppe einen aussagekräftigen Namen'}
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
        </ModalBody>
        <ModalFooter>
          <ModalButton type="button" kind={KIND.tertiary} onClick={onClose}>
            Abbrechen
          </ModalButton>
          <ModalButton disabled={!formik.isValid} type="submit">
            Gruppe erstellen
          </ModalButton>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default ModifyGroupModal;
