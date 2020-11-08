import { H1, HeadingLarge } from 'baseui/typography';
import React from 'react';
import { useAuth } from '../../lib/digitalstage/useAuth';
import useStageSelector from '../../lib/digitalstage/useStageSelector';
import PageWrapper from '../../components/new/elements/PageWrapper';
import Container from '../../components/new/elements/Container';

const Profile = () => {
  const { user: authUser } = useAuth();
  const { user } = useStageSelector((state) => ({
    user: state.user,
  }));

  return (
    <PageWrapper>
      <Container>
        {user && (
        <>
          <H1>{user.name}</H1>
          <H1>{authUser.email}</H1>
          <H1>{user.avatarUrl}</H1>
        </>
        )}
      </Container>
    </PageWrapper>
  );
};

export default Profile;
