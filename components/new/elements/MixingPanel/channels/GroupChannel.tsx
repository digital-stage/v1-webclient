/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, IconButton, Flex } from 'theme-ui';
import { styled } from 'styletron-react';
import { ChevronLeft, ChevronRight } from 'baseui/icon';
import { Caption1 } from 'baseui/typography';
import { GroupId } from '../../../../../lib/digitalstage/common/model.server';
import useStageSelector, {
  useIsStageAdmin,
} from '../../../../../lib/digitalstage/useStageSelector';
import { CustomGroup, Group } from '../../../../../lib/digitalstage/useStageContext/model';
import useStageActions from '../../../../../lib/digitalstage/useStageActions';
import StageMemberChannel from './StageMemberChannel';
import { useStageWebAudio } from '../../../../../lib/useStageWebAudio';
import ChannelStrip from '../../ChannelStrip';
import { Panel } from 'baseui/accordion';

const PanelRow = styled(Panel, {
  display: 'flex',
  flexDirection: 'row',
  borderRadius: '20px',
  marginRight: '1rem',
});
const Column = styled('div', {
  paddingLeft: '1rem',
  paddingRight: '1rem',
  paddingTop: '3rem',
  paddingBottom: '3rem',
  height: '100%',
});
const Row = styled('div', {
  paddingTop: '1rem',
  paddingBottom: '1rem',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  display: 'flex',
  flexDirection: 'row',
  height: '100%',
});
const InnerRow = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: 'rgba(130,100,130,1)',
  borderRadius: '20px',
  height: '100%',
});
const ColumnWithChildren = styled('div', {
  height: '100%',
});
const Header = styled('div', {
  width: '100%',
  height: '64px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const GroupChannel = (props: { groupId: GroupId }) => {
  const { groupId } = props;
  const isAdmin: boolean = useIsStageAdmin();
  const group = useStageSelector<Group>((state) => state.groups.byId[groupId]);
  const customGroup = useStageSelector<CustomGroup>((state) =>
    state.customGroups.byGroup[groupId]
      ? state.customGroups.byId[state.customGroups.byGroup[groupId]]
      : undefined
  );
  const stageMemberIds = useStageSelector<string[]>((state) =>
    state.stageMembers.byGroup[groupId] ? state.stageMembers.byGroup[groupId] : []
  );

  const { updateGroup, setCustomGroup, removeCustomGroup } = useStageActions();
  const { byGroup } = useStageWebAudio();

  const [expanded, setExpanded] = React.useState<boolean>();

  return (
    <PanelRow>
      <Column>
        <ChannelStrip
          addHeader={
            <Header>
              {stageMemberIds.length > 0 ? (
                <IconButton
                  variant="outline"
                  onClick={() => setExpanded((prev) => !prev)}
                  sx={{ width: '100%', height: '100%' }}
                >
                  <Caption1>{group.name}</Caption1>
                  {expanded ? <ChevronLeft /> : <ChevronRight />}
                </IconButton>
              ) : (
                <Caption1>{group.name}</Caption1>
              )}
            </Header>
          }
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
      </Column>

      {expanded && (
        <Row>
          <InnerRow>
            {stageMemberIds.map((id, index) => (
              <ColumnWithChildren key={index}>
                <StageMemberChannel key={id} stageMemberId={id} />
              </ColumnWithChildren>
            ))}
          </InnerRow>
        </Row>
      )}
    </PanelRow>
  );
};
export default GroupChannel;
