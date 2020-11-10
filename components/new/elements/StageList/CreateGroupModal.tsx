/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import {
  jsx, Button, Flex, Heading,
} from 'theme-ui';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Client } from '../../../../lib/digitalstage/common/model.client';
import useStageActions from '../../../../lib/digitalstage/useStageActions';
import Modal from '../Modal';
import InputField from '../../../InputField';

export interface Values {
  name: string;
}
export interface IError {
  name?: string;
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
            <Heading as="h3" sx={{ color: 'background', fontSize: 3 }}>Neue Gruppe erstellen</Heading>
            <Heading as="h3" sx={{ color: 'background', fontSize: 0, my: 2 }}>After creating the group you can copy the link and invite people</Heading>
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
