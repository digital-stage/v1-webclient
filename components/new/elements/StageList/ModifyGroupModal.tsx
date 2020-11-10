/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import {
  jsx, Flex, Button, Heading,
} from 'theme-ui';

import {
  Field, FormikProvider, useFormik,
} from 'formik';
import * as Yup from 'yup';
import { Client } from '../../../../lib/digitalstage/common/model.client';
import useStageActions from '../../../../lib/digitalstage/useStageActions';
import Modal from '../Modal';
import InputField from '../../../InputField';

const Schema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Zu kurz')
    .max(100, 'Zu lang')
    .required('Wird benötigt'),
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
      name: group ? group.name : '',
    },
    validationSchema: Schema,
    onSubmit: (values) => {
      updateGroup(group._id, {
        name: values.name,
      });
      onClose();
    },
  });

  React.useEffect(() => {
    if (group) formik.setValues({ name: group.name });
  }, [group]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <Heading as="h3" sx={{ color: 'background', fontSize: 3 }}>Gruppe ändern</Heading>
          <Heading as="h3" sx={{ color: 'background', fontSize: 0, my: 2 }}>Change your group name into a clearer name message</Heading>
          <Field
            as={InputField}
            type="text"
            name="name"
            id="name"
            label="Group name"
            version="dark"
            error={formik.errors.name && formik.touched.name}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <Flex sx={{ justifyContent: 'space-between', py: 2 }}>
            <Button variant="black" type="button" onClick={onClose}>
              Abbrechen
            </Button>
            <Button disabled={!formik.isValid} type="submit">
              Gruppe erstellen
            </Button>
          </Flex>
        </form>
      </FormikProvider>
    </Modal>
  );
};

export default ModifyGroupModal;
