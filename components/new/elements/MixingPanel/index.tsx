import { styled } from 'styletron-react';
import React from 'react';
import useStageSelector from '../../../../lib/digitalstage/useStageSelector';
import GroupChannel from './channels/GroupChannel';

const Wrapper = styled('div', {
  width: '100%',
  height: '100%',
  minHeight: '400px',
  maxHeight: '600px',
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'row',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  flexWrap: 'nowrap',
  padding: '1rem',
});

/** *
 * The mixing panel shows all available volume controls for an active stage
 * @constructor
 */
const MixingPanelView = () => {
  const groupIds = useStageSelector<string[]>(
    (state) => (state.stageId ? state.groups.byStage[state.stageId] : []),
  );

  return (
    <Wrapper>
      {groupIds.map((id) => <GroupChannel key={id} groupId={id} />)}
    </Wrapper>
  );
};
export default MixingPanelView;
