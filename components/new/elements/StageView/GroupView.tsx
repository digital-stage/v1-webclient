import React from 'react';
import { useStyletron } from 'baseui';
import { Cell, Grid } from 'baseui/layout-grid';
import { Heading } from 'baseui/heading';
import { H2 } from 'baseui/typography';
import StageMemberView from './StageMemberView';
import { Group } from '../../../../lib/digitalstage/useStageContext/model';
import { useStageMembersByGroup } from '../../../../lib/digitalstage/useStageSelector';

const GroupView = (props: {
  group: Group
}) => {
  const { group } = props;
  const [css] = useStyletron();
  const stageMembers = useStageMembersByGroup(group._id);

  if (stageMembers.length > 0) {
    return (
      <div className={css({})}>
        <Grid>
          <Cell span={12}>
            <H2>{props.group.name}</H2>
          </Cell>
        </Grid>
        <div className={css({
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
        })}
        >
          {stageMembers.map((stageMember) => (
            <StageMemberView key={stageMember._id} stageMember={stageMember} />
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default GroupView;
