/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Client } from '../../../../lib/digitalstage/common/model.client';
import useStageActions from '../../../../lib/digitalstage/useStageActions';
import Modal from '../Modal';
import InputField from '../../../InputField';
import { jsx, Button, Flex, Heading, Message } from 'theme-ui';

export interface Values {
  name: string;
}
export interface IError {
  name?: string;
}

const CreateGroupModal = (props: {
  stage: Client.Stage;
  isOpen?: boolean;
  onClose?: () => any;
}) => {
  const { stage, isOpen, onClose } = props;
  const [msg, setMsg] = React.useState({
    state: false,
    type: null,
    kids: null
  });
  const { createGroup } = useStageActions();

  const CreateGroupSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Zu kurz')
      .max(100, 'Zu lang')
      .required('Wird benötigt')
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <Formik
        initialValues={{
          name: ''
        }}
        validationSchema={CreateGroupSchema}
        onSubmit={(values: Values, { resetForm }: FormikHelpers<Values>) => {
          createGroup(stage._id, values.name)
          props.onClose()
            .then(() => {
              resetForm(null);
            })
            .catch(err =>
              setMsg({
                state: true,
                type: 'danger',
                kids: { err }
              })
            )
        }}
      >
        {({ errors, touched }) => (
          <Form>
            {msg.state && <Message variant={msg.type}>{msg.kids}</Message>}

            <Heading as="h3" sx={{ color: "background", fontSize: 3 }}>Neue Gruppe erstellen</Heading>
            <Field
              as={InputField}
              required
              type="text"
              name="name"
              id="name"
              label="Group name"
              version="dark"
              error={errors.name && touched.name}
            />
            <Flex sx={{ justifyContent: "space-between", py: 3 }}>
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
