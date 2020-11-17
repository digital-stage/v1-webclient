/* eslint-disable react/destructuring-assignment */
/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Box, Text, Heading } from 'theme-ui';
import { useAuth } from '../../lib/digitalstage/useAuth';
import useStageSelector from '../../lib/digitalstage/useStageSelector';

const Profile = () => {
  const { user: authUser } = useAuth();
  const { user } = useStageSelector((state) => ({ user: state.user }));

  return (
    <Box>
      <Heading>Profile</Heading>
      <Text variant="title" sx={{ color: 'text' }} mb={3}>
        {user.name}
      </Text>
      <Text variant="subTitle" sx={{ color: 'text' }} mb={3}>
        {authUser.email}
      </Text>
    </Box>
  );
};

export default Profile;
