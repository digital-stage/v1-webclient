/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Flex, IconButton, Heading, Avatar, Text } from 'theme-ui';
import { FaPen, FaTrash } from 'react-icons/fa';
import { Stage } from '../../../../lib/digitalstage/common/model.client';
import useStageActions from '../../../../lib/digitalstage/useStageActions';
import ModifyStageModal from './ModifyStageModal';

const StageHeader = (props: { stage: Stage }): JSX.Element => {
  const { removeStage, leaveStageForGood } = useStageActions();
  const [currentStage, setCurrentStage] = React.useState<Stage>();
  const [isModifyStageOpen, setModifyStageIsOpen] = React.useState<boolean>(false);

  const { stage } = props;
  return (
    <Box sx={{ width: '100%', py: '24px' }}>
      <Flex sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Flex>
          <Avatar src="/images/diverse 5.svg" sx={{ my: 'auto', mr: 2 }} />
          <Flex sx={{ flexDirection: 'column' }}>
            <Heading as="h3" sx={{ color: 'gray.0', flexBasis: 'max-content' }}>
              {stage.name}
            </Heading>
            <Flex>
              <Text variant="subTitle" sx={{ color: 'text' }}>
                {stage.isAdmin && 'Du verwaltest diese Bühne'}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Box sx={{ color: 'secondary' }}>
          <IconButton
            aria-label="Bühne bearbeiten"
            onClick={() => {
              setCurrentStage(stage);
              setModifyStageIsOpen(true);
            }}
          >
            <FaPen />
          </IconButton>
          <IconButton
            aria-label={stage.isAdmin ? 'Bühne entfernen' : 'Bühne verlassen'}
            onClick={() => {
              if (stage.isAdmin) removeStage(stage._id);
              else leaveStageForGood(stage._id);
            }}
          >
            <FaTrash />
          </IconButton>
        </Box>
      </Flex>
      <ModifyStageModal
        stage={currentStage}
        isOpen={isModifyStageOpen}
        onClose={() => setModifyStageIsOpen(false)}
      />
    </Box>
  );
};

export default StageHeader;
