/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Flex, Button, Text, Heading } from 'theme-ui';
import { Field, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from '../Modal';
import InputField from '../../../InputField';
import useStageActions from '../../../../lib/use-digital-stage/useStageActions';
import { Group } from '../../../../lib/use-digital-stage/types';

const Schema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Der Name ist zu kurz')
    .max(100, 'Der Name ist zu lang')
    .required('Ein Gruppenname wird benötigt'),
});

const ModifyGroupModal = (props: {
  group: Group;
  isOpen?: boolean;
  onClose?: () => any;
}): JSX.Element => {
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <Heading variant="title">Gruppenname ändern</Heading>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <Field
            as={InputField}
            type="text"
            name="name"
            id="name"
            label="Gruppenname"
            version="dark"
            error={formik.errors.name && formik.touched.name}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <Flex sx={{ justifyContent: 'center', pt: 7 }}>
            <Button variant="tertiary" sx={{ color: 'gray.5' }} type="button" onClick={onClose}>
              Abbrechen
            </Button>
            <Button disabled={!formik.isValid} type="submit">
              Speichern
            </Button>
          </Flex>
        </form>
      </FormikProvider>
    </Modal>
  );
};

export default ModifyGroupModal;
