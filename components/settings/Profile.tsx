/** @jsxRuntime classic */
/** @jsx jsx */
import { Field, Form, Formik } from 'formik';
import { Box, Button, Flex, Heading, jsx, Text } from 'theme-ui';
import * as Yup from 'yup';
import { useAuth } from '../../lib/digitalstage/useAuth';
import useStageActions from '../../lib/digitalstage/useStageActions';
import useStageSelector from '../../lib/digitalstage/useStageSelector';
import InputField from '../InputField';
interface Values {
  name: string;
}

const Profile = (): JSX.Element => {
  const { user: authUser } = useAuth();
  const { user } = useStageSelector((state) => ({ user: state.user }));
  const { updateUser } = useStageActions();

  const UpdateProfileSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Der Name ist kurz')
      .max(70, 'Der Name ist zu lang')
      .required('Der Name ist notwendig'),
  });

  return (
    <Box>
      <Heading mb={3}>Profilverwaltung</Heading>
      <Text variant="subTitle" sx={{ color: 'text' }} mb={3}>
        {authUser.email}
      </Text>
      <Formik
        initialValues={{
          name: user.name,
        }}
        validationSchema={UpdateProfileSchema}
        onSubmit={(values: Values) => {
          updateUser(values.name);
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <Field
              as={InputField}
              id="name"
              label="Name"
              name="name"
              type="text"
              error={errors.name && touched.name}
            />
            <Flex sx={{ justifyContent: 'flex-end', my: 3 }}>
              <Button variant="secondary" type="submit">
                Name aktualisieren
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Profile;
