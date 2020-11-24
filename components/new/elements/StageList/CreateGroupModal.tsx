/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Button, Flex, Text, Heading } from 'theme-ui';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import InputField from '../../../InputField';
import Modal from '../Modal';
import useStageActions from '../../../../lib/use-digital-stage/useStageActions';
import { Stage } from '../../../../lib/use-digital-stage/types';

interface Values {
  name: string;
}

const CreateGroupModal = (props: {
  stage: Stage;
  isOpen?: boolean;
  onClose?: () => void;
}): JSX.Element => {
  const { stage, isOpen, onClose } = props;
  const { createGroup } = useStageActions();

  const CreateGroupSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Der Name ist zu kurz')
      .max(100, 'Der Name ist zu lang')
      .required('Ein Gruppenname wird benötigt'),
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Heading variant="title">Neue Gruppe erstellen</Heading>
      <Text variant="subTitle">
        Nachdem Du die Gruppe erstellt hast kannst Du über den Button &apos;Einladen&apos;
        Teilnehmer hinzufügen
      </Text>
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
              label="Gruppenname"
              version="dark"
              error={errors.name && touched.name}
            />
            <Flex sx={{ justifyContent: 'space-between', py: 3 }}>
              <Button variant="black" onClick={onClose}>
                Abbrechen
              </Button>
              <Button type="submit">Erstellen</Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreateGroupModal;
