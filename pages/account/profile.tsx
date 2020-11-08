/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Heading } from 'theme-ui';
import { useAuth } from '../../lib/digitalstage/useAuth';
import useStageSelector from '../../lib/digitalstage/useStageSelector';
import Layout from '../../components/Layout';
import Container from '../../components/Container';

const Profile = () => {
  const { user: authUser } = useAuth();
  const { user } = useStageSelector((state) => ({ user: state.user }));

  return (
    <Layout>
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
