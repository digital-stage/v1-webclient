/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Button, Flex, Heading } from 'theme-ui';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import Input from '../../../digitalstage-ui/extra/Input';
import useStageActions from '../../../lib/use-digital-stage/useStageActions';
import { LightDialog } from '../../../digitalstage-ui/extra/Dialog';

interface Values {
  name: string;
  password: string;
  width: number;
  length: number;
  height: number;
  damping: number;
  absorption: number;
}

const CreateStageSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Der Name ist zu kurz')
    .max(100, 'Der Name ist zu lang')
    .required('Ein Bühnenname wird benötigt'),
  password: Yup.string().min(5, 'Das Passwort ist zu kurz').max(50, 'Das Passwort ist zu lang'),
  width: Yup.number().min(0.1).max(1000),
  length: Yup.number().min(0.1).max(1000),
  height: Yup.number().min(0.1).max(1000),
  absorption: Yup.number().min(0.1).max(1),
  reflection: Yup.number().min(0.1).max(1),
});

const CreateStageModal = (props: {
  isOpen?: boolean;
  onClose?(): void;
  setStageCreated(stageCreated: boolean): void;
}): JSX.Element => {
  const { isOpen, onClose } = props;
  const { createStage } = useStageActions();

  return (
    <LightDialog size="dialog" closable open={isOpen} onClose={onClose}>
      <Heading variant="title">Neue Bühne erstellen</Heading>
      <Formik
        initialValues={{
          name: '',
          password: '',
          width: 25,
          length: 13,
          height: 7.5,
          damping: 0.7,
          absorption: 0.6,
        }}
        validationSchema={CreateStageSchema}
        onSubmit={(values: Values) => {
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
          props.setStageCreated(true);
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <Field
              as={Input}
              type="text"
              name="name"
              id="name"
              label="Name der Bühne"
              version="dark"
              error={errors.name && touched.name}
            />
            <Field
              as={Input}
              required={false}
              type="text"
              name="password"
              id="password"
              label="Passwort"
              version="dark"
              error={errors.password && touched.password}
            />
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
            <Flex sx={{ justifyContent: 'center', pt: 7 }}>
              <Button variant="tertiary" sx={{ color: 'gray.5' }} type="button" onClick={onClose}>
                Abbrechen
              </Button>
              <Button type="submit">Erstellen</Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </LightDialog>
  );
};
export default CreateStageModal;
