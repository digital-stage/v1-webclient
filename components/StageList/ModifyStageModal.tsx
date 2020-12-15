/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Flex, Button, Heading } from 'theme-ui';
import { useFormik, FormikProvider, Field } from 'formik';
import * as Yup from 'yup';
import Dialog from '../ui/Dialog';
import InputField from '../ui/InputField';
import { Stage } from '../../lib/use-digital-stage/types';
import useStageActions from '../../lib/use-digital-stage/useStageActions';

const Schema = Yup.object().shape({
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

const ModifyStageModal = (props: {
  stage: Stage;
  isOpen?: boolean;
  onClose?: () => any;
}): JSX.Element => {
  const { stage, isOpen, onClose } = props;
  const { updateStage } = useStageActions();
  const formik = useFormik({
    initialValues: stage
      ? {
          name: stage.name,
          password: stage.password,
          width: stage.width,
          length: stage.length,
          height: stage.height,
          absorption: stage.absorption,
          damping: stage.damping,
        }
      : {
          name: '',
          password: '',
          width: 25,
          length: 13,
          height: 7.5,
          damping: 0.7,
          absorption: 0.6,
        },
    validationSchema: Schema,
    onSubmit: (values) => {
      updateStage(stage._id, {
        name: values.name,
        password: values.password,
        width: values.width,
        length: values.length,
        height: values.height,
        absorption: values.absorption,
        damping: values.damping,
      });
      onClose();
    },
  });

  React.useEffect(() => {
    if (stage) {
      formik.setValues({
        name: stage.name,
        password: stage.password,
        width: stage.width,
        length: stage.length,
        height: stage.height,
        absorption: stage.absorption,
        damping: stage.damping,
      });
    }
  }, [stage]);

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <Heading variant="title">Bühne bearbeiten</Heading>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <Field
            as={InputField}
            type="text"
            name="name"
            id="name"
            label="Name der Bühne"
            version="dark"
            error={formik.errors.name && formik.touched.name}
          />
          <Field
            as={InputField}
            type="text"
            name="password"
            id="password"
            label="Passwort"
            version="dark"
            error={formik.errors.password && formik.touched.password}
          />
          <Flex sx={{ justifyContent: 'center', pt: 7 }}>
            <Button variant="tertiary" sx={{ color: 'gray.5' }} type="button" onClick={onClose}>
              Abbrechen
            </Button>
            <Button type="submit">Speichern</Button>
          </Flex>
        </form>
      </FormikProvider>
    </Dialog>
  );
};

export default ModifyStageModal;
