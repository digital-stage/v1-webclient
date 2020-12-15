/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Divider, Flex } from 'theme-ui';
import Card from '../../../Card';
import StageOverviewLinks from '../../../StageOverviewLinks';
import Collapse from '../../../Collapse';
import CollapseHeader from '../../../CollapseHeader';
import CollapseBody from '../../../CollapseBody';
import StageHeader from './StageHeader';
import StageGroupList from './StageGroupList';
import { useStages } from '../../../../lib/use-digital-stage/hooks';

/**  TODO: WORK in PROGRESS POC */

const StageListView = (): JSX.Element => {
  const stages = useStages();
  const [openCollapse, setOpenCollapse] = React.useState<boolean>(false);
  const [collapseId, setCollapseId] = React.useState<string>();
  const [stageCreated, setStageCreated] = React.useState<boolean>(false);

  React.useEffect(() => {
    setOpenCollapse(true);
    setCollapseId(collapseId);
  }, [collapseId]);

  React.useEffect(() => {
    if (stageCreated) {
      setOpenCollapse(true);
      setCollapseId(stages.allIds[stages.allIds.length - 1]);
      setStageCreated(false);
    }
  }, [stages]);

  return (
    <Card mt={5}>
      <StageOverviewLinks setStageCreated={(stageCreated) => setStageCreated(stageCreated)} />
      {/**  TODO: WORK in PROGRESS */}
      <Flex sx={{ flexDirection: 'column' }}>
        {stages.allIds
          .map((id) => stages.byId[id])
          .map((stage) => (
            <Collapse key={stage._id} id={stage._id}>
              <CollapseHeader
                isOpen={openCollapse}
                onClick={() => {
                  setOpenCollapse(!openCollapse);
                  setCollapseId(stage._id);
                }}
                id={stage._id}
                collapseId={collapseId}
              >
                <StageHeader stage={stage} />
              </CollapseHeader>
              <CollapseBody isOpen={openCollapse} id={stage._id} collapseId={collapseId}>
                <StageGroupList stage={stage} />
              </CollapseBody>
              <Divider sx={{ color: 'gray.3' }} />
            </Collapse>
          ))}
      </Flex>
    </Card>
  );
};

export default StageListView;
