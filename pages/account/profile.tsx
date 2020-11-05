import { HeadingLarge } from 'baseui/typography';
import React from 'react';
import { useAuth } from '../../lib/digitalstage/useAuth';
import useStageSelector from '../../lib/digitalstage/useStageSelector';
import Layout from '../../components/Layout';
import Container from '../../components/new/elements/Container';

const Profile = () => {
  const { user: authUser } = useAuth();
  const { user } = useStageSelector((state) => ({
    user: state.user,
  }));

  return (
    <Layout>
      <Container>
        {user && (
          <>
            <HeadingLarge>{user.name}</HeadingLarge>
            <HeadingLarge>{authUser.email}</HeadingLarge>
            <HeadingLarge>{user.avatarUrl}</HeadingLarge>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default Profile;
