/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Heading } from 'theme-ui';
import { useAuth } from '../../lib/useAuth';
import Layout from '../../components/Layout';
import Container from '../../components/ui/Container';
import { useCurrentUser } from '../../lib/use-digital-stage/hooks';

const Profile = (): JSX.Element => {
  const { user: authUser } = useAuth();
  const user = useCurrentUser();

  return (
    <Layout auth>
      <Container>
        {user && (
          <React.Fragment>
            <Heading>{user.name}</Heading>
            <Heading>{authUser.email}</Heading>
            {user.avatarUrl && <Heading>{user.avatarUrl}</Heading>}
          </React.Fragment>
        )}
      </Container>
    </Layout>
  );
};

export default Profile;
