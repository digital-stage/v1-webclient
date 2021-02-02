/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Flex, Text, Heading, Button, Grid, Box } from 'theme-ui';
import * as Yup from 'yup';
import SettingsLayout from '../../components/layout/SettingsLayout';
import { useIntl } from 'react-intl';
import LoadingOverlay from '../../components/global/LoadingOverlay';
import { useAuth } from '../../lib/useAuth';
import { useCurrentUser, useStageActions } from '../../lib/use-digital-stage';
import SettingsNavigation from '../../components/settings/SettingsNavigation';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Field, Form, Formik } from 'formik';
import Input from '../../digitalstage-ui/extra/Input';

interface Values {
  name: string;
}

const ProfileSettings = (): JSX.Element => {
  const { user: authUser } = useAuth();
  const user = useCurrentUser();
  const { updateUser } = useStageActions();
  const { pathname, locale } = useRouter();
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });

  const UpdateProfileSchema = Yup.object().shape({
    name: Yup.string().min(2, f('nameTooShort')).max(70, 'nameTooLong').required('nameRequired'),
  });

  if (authUser && user) {
    return (
      <SettingsLayout>
        <SettingsNavigation />
        <Heading mb={5}>{f('manageProfile')}</Heading>
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
              <Grid
                sx={{
                  py: 3,
                  px: 5,
                }}
                columns={['1fr 2fr']}
              >
                <Flex
                  sx={{
                    alignItems: 'center',
                  }}
                >
                  {f('language')}
                </Flex>
                <Flex
                  sx={{
                    alignItems: 'flex-start',
                  }}
                >
                  {locale === 'de' ? (
                    <Link href={pathname} locale="en">
                      <Button variant="primary">{f('switchToEnglish')}</Button>
                    </Link>
                  ) : (
                    <Link href={pathname} locale="de">
                      <Button variant="primary">{f('switchToGerman')}</Button>
                    </Link>
                  )}
                </Flex>
                <Flex
                  sx={{
                    alignItems: 'flex-start',
                  }}
                >
                  {f('email')}
                </Flex>
                <Text>{authUser.email}</Text>
                <Flex
                  sx={{
                    alignItems: 'flex-start',
                  }}
                >
                  {f('name')}
                </Flex>
                <Field
                  as={Input}
                  id="name"
                  label={f('name')}
                  name="name"
                  type="text"
                  error={errors.name && touched.name}
                />
              </Grid>
              <Flex sx={{ justifyContent: 'flex-end', my: 3 }}>
                <Button variant="primary" type="submit">
                  {f('save')}
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </SettingsLayout>
    );
  }

  return <LoadingOverlay />;
};
export default ProfileSettings;
