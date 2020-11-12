/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Divider, Flex } from 'theme-ui';
import { useStages } from '../../../../lib/digitalstage/useStageSelector';
import Card from '../../../Card';
import StageOverviewLinks from '../../../StageOverviewLinks';
import Collapse from '../../../Collapse';
import CollapseHeader from '../../../CollapseHeader';
import CollapseBody from '../../../CollapseBody';
import StageHeader from './StageHeader';
import StageGroupList from './StageGroupList';

/**  TODO: WORK in PROGRESS POC */

const StageListView = (): JSX.Element => {
  const stages = useStages();
  const [openCollapse, setOpenCollapse] = React.useState<boolean>(false);
  const [collapseId, setCollapseId] = React.useState<string>();

  React.useEffect(() => {
    setOpenCollapse(true)
    setCollapseId(collapseId)
  }, [collapseId])

  return (
    <Card mt={3}>
      <StageOverviewLinks />
      {/**  TODO: WORK in PROGRESS */}
      <Flex sx={{ flexDirection: 'column' }}>
        {stages.map((stage) => (
          <Collapse key={stage._id} id={stage._id}>
            <CollapseHeader isOpen={openCollapse} onClick={() => { setOpenCollapse(!openCollapse); setCollapseId(stage._id) }} id={stage._id} collapseId={collapseId}>
              <StageHeader stage={stage} />
            </CollapseHeader>
            <CollapseBody isOpen={openCollapse} id={stage._id} collapseId={collapseId}>
              <StageGroupList stage={stage} />
            </CollapseBody>
            <Divider sx={{ color: 'gray.2' }} />
          </Collapse>
        ))}
      </Flex>
    </Card>
  );
};

export default StageListView;
