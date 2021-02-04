/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Flex, Text, Heading, Button, Grid, Box, Link as ThemeLink } from 'theme-ui';
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
  const { user: authUser, logout } = useAuth();
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
                  alignItems: 'center',
                }}
                gap={6}
                columns={['1fr', '1fr 2fr']}
              >
                <Heading variant="h5">{f('language')}</Heading>
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

                <Heading variant="h5">{f('email')}</Heading>
                <Text>{authUser.email}</Text>

                <Heading variant="h5">{f('name')}</Heading>
                <Flex sx={{ alignItems: 'center' }}>
                  <Field
                    as={Input}
                    sx={{
                      flexGrow: 1,
                    }}
                    id="name"
                    label={f('name')}
                    name="name"
                    type="text"
                    error={errors.name && touched.name}
                  />
                  <Button sx={{ flexGrow: 0 }} variant="primary" type="submit">
                    {f('save')}
                  </Button>
                </Flex>

                <Box></Box>
                <Flex sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Button mb={4} variant="danger" onClick={logout}>
                    {f('signOut')}
                  </Button>

                  <Link href="/account/forgot">
                    <ThemeLink as="a">{f('resetPassword')}</ThemeLink>
                  </Link>
                </Flex>
              </Grid>
            </Form>
          )}
        </Formik>
      </SettingsLayout>
    );
  }

  return <LoadingOverlay />;
};
export default ProfileSettings;
