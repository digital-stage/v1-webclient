/** @jsxRuntime classic */
/** @jsx jsx */
import { Box, Heading, jsx, Text } from 'theme-ui';
import { useAuth } from '../../lib/digitalstage/useAuth';
import useStageSelector from '../../lib/digitalstage/useStageSelector';

const Profile = (): JSX.Element => {
  const { user: authUser } = useAuth();
  const { user } = useStageSelector((state) => ({ user: state.user }));

  return (
    <Box>
      <Heading mb={3}>Profilverwaltung</Heading>
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
