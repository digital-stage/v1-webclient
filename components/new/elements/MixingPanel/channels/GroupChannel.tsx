/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui';
// import StageMemberChannel from './StageMemberChannel';
import { useStageWebAudio } from '../../../../../lib/useStageWebAudio';
import ChannelStrip from '../../ChannelStrip';
import { useGroup, useIsStageAdmin, useSelector } from '../../../../../lib/use-digital-stage/hooks';
import { CustomGroup } from '../../../../../lib/use-digital-stage/types';
import useStageActions from '../../../../../lib/use-digital-stage/useStageActions';

const GroupChannel = (props: { groupId: string }): JSX.Element => {
  const { groupId } = props;
  const isAdmin: boolean = useIsStageAdmin();
  const group = useGroup(groupId);
  const customGroup = useSelector<CustomGroup>((state) =>
    state.customGroups.byGroup[groupId]
      ? state.customGroups.byId[state.customGroups.byGroup[groupId]]
      : undefined
  );
  // const stageMemberIds = useSelector<string[]>((state) =>
  //   state.stageMembers.byGroup[groupId] ? state.stageMembers.byGroup[groupId] : []
  // );

  const { updateGroup, setCustomGroup, removeCustomGroup } = useStageActions();
  const { byGroup } = useStageWebAudio();

  return (
    <ChannelStrip
      // addHeader={
      //   <Flex
      //     sx={{
      //       width: '100%',
      //       height: '64px',
      //       justifyContent: 'center',
      //       alignItems: 'center',
      //     }}
      //   >
      //     {stageMemberIds.length > 0 ? (
      //       <IconButton
      //         variant="outline"
      //         onClick={() => setExpanded((prev) => !prev)}
      //         sx={{ width: '100%', height: '100%' }}
      //       >
      //         <Text>{group.name}</Text>
      //         {expanded ? <FaChevronLeft /> : <FaChevronRight />}
      //       </IconButton>
      //     ) : (
      //         <Text>{group.name}</Text>
      //       )}
      //   </Flex>
      // }
      group={group}
      analyser={byGroup[groupId] ? byGroup[groupId].analyserNode : undefined}
      volume={group.volume}
      muted={group.muted}
      customVolume={customGroup ? customGroup.volume : undefined}
      customMuted={customGroup ? customGroup.muted : undefined}
      onVolumeChanged={
        isAdmin
          ? (volume, muted) =>
              updateGroup(group._id, {
                volume,
                muted,
              })
          : undefined
      }
      onCustomVolumeChanged={(volume, muted) => setCustomGroup(group._id, volume, muted)}
      onCustomVolumeReset={() => {
        if (removeCustomGroup) return removeCustomGroup(customGroup._id);
        return null;
      }}
      isAdmin={isAdmin}
    />
  );

  // {expanded && (
  //   <Flex
  //     sx={{
  //       paddingTop: '1rem',
  //       paddingBottom: '1rem',
  //       paddingLeft: '1rem',
  //       paddingRight: '1rem',
  //       flexDirection: 'row',
  //       height: '100%',
  //     }}
  //   >
  //     <Flex
  //       sx={{
  //         flexDirection: 'row',
  //         backgroundColor: 'rgba(130,100,130,1)',
  //         borderRadius: '20px',
  //         height: '100%',
  //       }}
  //     >
  //       {stageMemberIds.map((id, index) => (
  //         <Box key={index} sx={{ width: "100%" }}>
  //           <StageMemberChannel key={id} stageMemberId={id} />
  //         </Box>
  //       ))}
  //     </Flex>
  //   </Flex>
  // )}
  // );
};
export default GroupChannel;
