/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import {
  jsx, Flex, Button, Text,
} from 'theme-ui';
import { useFormik, FormikProvider, Field } from 'formik';
import * as Yup from 'yup';
import { Client } from '../../../../lib/digitalstage/common/model.client';
import useStageActions from '../../../../lib/digitalstage/useStageActions';
import Modal from '../Modal';
import InputField from '../../../InputField';

const Schema = Yup.object().shape({
  name: Yup.string().min(2, 'Zu kurz').max(100, 'Zu lang').required('Wird benötigt'),
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
    .max(1),
});

const ModifyStageModal = (props: {
  stage: Client.Stage;
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <Text variant="title">Bühne ändern</Text>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <Field
            as={InputField}
            type="text"
            name="name"
            id="name"
            label="Group name"
            version="dark"
            error={formik.errors.name && formik.touched.name}
          />
          <Field
            as={InputField}
            type="text"
            name="password"
            id="password"
            label="Password"
            version="dark"
            error={formik.errors.password && formik.touched.password}
          />
          <Flex sx={{ justifyContent: 'space-between', py: 2 }}>
            <Button variant="black" type="button" onClick={onClose}>
              Abbrechen
            </Button>
            <Button type="submit">Bühne ändern</Button>
          </Flex>
        </form>
      </FormikProvider>
    </Modal>
  );
};

export default ModifyStageModal;
