/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Box, Text, Flex } from 'theme-ui';
import { Group } from '../../lib/digitalstage/common/model.server';
import useStageSelector, { useIsStageAdmin } from '../../lib/digitalstage/useStageSelector';

interface Props {
  groupId: string;
}

const GroupMixer = ({ groupId }: Props): JSX.Element => {
  const isAdmin: boolean = useIsStageAdmin();
  const group = useStageSelector<Group>((state) => state.groups.byId[groupId]);

  return (
    <Flex
      sx={{
        mx: 4,
        p: 3,
        bg: 'gray.7',
        borderRadius: 'card',
        minHeight: '100%',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        bg="primary"
        sx={{
          width: 'group.width',
          height: 'group.height',
          borderRadius: '50%',
        }}
      ></Box>
      <Text mb={3}>{group.name}</Text>
      <Box
        sx={{
          width: '100%',
          flexShrink: 0,
          flexGrow: 1,
          height: '1px',
          minHeight: '100px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      ></Box>
    </Flex>
  );
};

export default GroupMixer;
