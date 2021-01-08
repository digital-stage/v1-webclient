/** @jsxRuntime classic */
/** @jsx jsx */
import { Field, Form, Formik } from 'formik';
import { Button, Flex, Heading, jsx, Text } from 'theme-ui';
import * as Yup from 'yup';
import { Stage } from '../../lib/use-digital-stage/types';
import useStageActions from '../../lib/use-digital-stage/useStageActions';
import Input from '../../digitalstage-ui/elements/input/Input';
import Dialog from '../ui/Dialog';

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
    <Dialog isOpen={isOpen} onClose={onClose}>
      <Heading variant="title" pb={5}>
        Neue Gruppe erstellen
      </Heading>
      <Text variant="subTitle">
        Nachdem Du die Gruppe erstellt hast, kannst Du über den Button &apos;Einladen&apos;
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
              as={Input}
              type="text"
              name="name"
              id="name"
              label="Gruppenname"
              version="dark"
              error={errors.name && touched.name}
            />
            <Flex sx={{ justifyContent: 'center', pt: 7 }}>
              <Button variant="tertiary" sx={{ color: 'gray.5' }} onClick={onClose}>
                Abbrechen
              </Button>
              <Button type="submit">Erstellen</Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default CreateGroupModal;
