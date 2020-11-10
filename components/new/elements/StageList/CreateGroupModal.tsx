/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import {
  jsx, Button, Flex, Text,
} from 'theme-ui';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Client } from '../../../../lib/digitalstage/common/model.client';
import useStageActions from '../../../../lib/digitalstage/useStageActions';
import Modal from '../Modal';
import InputField from '../../../InputField';

interface Values {
  name: string;
}

const CreateGroupModal = (props: {
  stage: Client.Stage;
  isOpen?: boolean;
  onClose?: () => never;
}): JSX.Element => {
  const { stage, isOpen, onClose } = props;
  const { createGroup } = useStageActions();

  const CreateGroupSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Zu kurz')
      .max(100, 'Zu lang')
      .required('Wird benötigt'),
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Text variant="title">Neue Gruppe erstellen</Text>
      <Text variant="subTitle">After creating the group you can copy the link and invite people</Text>
      <Formik
        initialValues={{
          name: '',
        }}
        validationSchema={CreateGroupSchema}
        onSubmit={(values: Values) => {
          createGroup(stage._id, values.name);
          props.onClose();
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <Field
              as={InputField}
              type="text"
              name="name"
              id="name"
              label="Group name"
              version="dark"
              error={errors.name && touched.name}
            />
            <Flex sx={{ justifyContent: 'space-between', py: 3 }}>
              <Button variant="black" onClick={onClose}>
                Abbrechen
              </Button>
              <Button type="submit">
                Gruppe erstellen
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreateGroupModal;
