/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Divider, Flex } from 'theme-ui';
import StageHeader from './StageHeader';
import StageGroupList from './StageGroupList';
import { useStages } from '../../../lib/use-digital-stage/hooks';
import Collapse, { CollapseBody, CollapseHeader } from '../../../digitalstage-ui/extra/Collapse';
import ActionBar from './ActionBar';

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
    <Flex
      sx={{
        p: 24,
        flexDirection: 'column',
      }}
    >
      <ActionBar setStageCreated={(stageCreated) => setStageCreated(stageCreated)} />
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
                <StageHeader
                  onTitleClicked={() => {
                    setOpenCollapse(!openCollapse);
                    setCollapseId(stage._id);
                  }}
                  stage={stage}
                />
              </CollapseHeader>
              <CollapseBody isOpen={openCollapse} id={stage._id} collapseId={collapseId}>
                <StageGroupList stage={stage} />
              </CollapseBody>
              <Divider sx={{ color: 'gray.3' }} />
            </Collapse>
          ))}
      </Flex>
    </Flex>
  );
};

export default StageListView;
