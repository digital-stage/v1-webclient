import React from 'react';
import GroupView from './GroupView';
import ConductorsView from './ConductorsView';
import { useGroupsByStage } from '../../../../lib/use-digital-stage/hooks';
import { Stage } from '../../../../lib/use-digital-stage/types';

const StageView = (props: { stage: Stage }) => {
  const { stage } = props;
  const groups = useGroupsByStage(stage._id);

  return (
    <div>
      {groups.map((group) => (
        <GroupView key={group._id} group={group} />
      ))}
      <ConductorsView />
    </div>
  );
};

export default StageView;
