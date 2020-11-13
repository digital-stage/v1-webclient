/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Flex, Button, IconButton, Heading } from 'theme-ui';
import { FaPlus, FaPen, FaTrash } from 'react-icons/fa';
import { Groups, NormalizedState } from '../../../../lib/digitalstage/useStageContext/schema';
import { useSelector } from '../../../../lib/digitalstage/useStageContext/redux';
import useStageActions from '../../../../lib/digitalstage/useStageActions';
import { Stage, Group } from '../../../../lib/digitalstage/common/model.client';
import { useRequest } from '../../../../lib/useRequest';
import InviteModal from './InviteModal';
import ModifyGroupModal from './ModifyGroupModal';
import CreateGroupModal from './CreateGroupModal';
import useStageSelector from '../../../../lib/digitalstage/useStageSelector';

const StageGroupList = (props: { stage: Stage }): JSX.Element => {
  const groups = useStageSelector<Groups>((state) => state.groups);
  const currentStageId = useSelector<NormalizedState, string | undefined>((state) => state.stageId);
  const currentGroupId = useSelector<NormalizedState, string | undefined>((state) => state.groupId);
  const { removeGroup, leaveStage } = useStageActions();
  const { setRequest } = useRequest();
  const [currentStage, setCurrentStage] = React.useState<Stage>();
  const [currentGroup, setCurrentGroup] = React.useState<Group>();
  const [isCreateGroupOpen, setCreateGroupIsOpen] = React.useState<boolean>(false);
  const [isModifyGroupOpen, setModifyGroupIsOpen] = React.useState<boolean>(false);
  const [isCopyLinkOpen, setCopyLinkOpen] = React.useState<boolean>();

  const { stage } = props;
  return (
    <Box sx={{ bg: 'gray.5', mx: '-32px', px: '38px', py: 3 }}>
      {groups.byStage[stage._id] &&
        groups.byStage[stage._id].map((groupId) => {
          const group = groups.byId[groupId];

          return (
            <React.Fragment key={group._id}>
              <Flex sx={{ justifyContent: 'space-between' }}>
                <Flex sx={{ alignItems: 'center', my: 2 }}>
                  <Box
                    bg="primary"
                    sx={{
                      minWidth: 'group.width',
                      minHeight: 'group.height',
                      borderRadius: '50%',
                      mr: 3,
                    }}
                  ></Box>
                  <Heading as="h3" sx={{ color: 'gray.0', flexBasis: 'max-content' }}>
                    {group.name}
                  </Heading>
                </Flex>

                {stage.isAdmin && (
                  <Flex sx={{ alignItems: 'center' }}>
                    <Box>
                      <IconButton
                        aria-label="Gruppe bearbeiten"
                        onClick={() => {
                          setCurrentStage(stage);
                          setCurrentGroup(group);
                          setModifyGroupIsOpen((prevState) => !prevState);
                        }}
                      >
                        <FaPen />
                      </IconButton>
                      <IconButton
                        aria-label="Gruppe entfernen"
                        onClick={() => {
                          removeGroup(group._id);
                        }}
                      >
                        <FaTrash />
                      </IconButton>
                    </Box>

                    <Box>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCurrentStage(stage);
                          setCurrentGroup(group);
                          setCopyLinkOpen((prevState) => !prevState);
                        }}
                      >
                        Einladen
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          if (
                            currentStageId &&
                            stage._id === currentStageId &&
                            group._id === currentGroupId
                          ) {
                            leaveStage();
                          } else {
                            setRequest(stage._id, group._id, stage.password);
                          }
                        }}
                      >
                        {currentStageId &&
                        stage._id === currentStageId &&
                        group._id === currentGroupId
                          ? 'Verlassen'
                          : 'Betreten'}
                      </Button>
                    </Box>
                  </Flex>
                )}
              </Flex>
            </React.Fragment>
          );
        })}

      {stage.isAdmin && (
        <Flex my={2}>
          <Button
            variant="text"
            onClick={() => {
              setCurrentStage(stage);
              setCreateGroupIsOpen(true);
            }}
          >
            <Box
              as="span"
              sx={{
                color: 'secondary',
                textAlign: 'center',
                pt: 2,
                mr: [2, null, 3],
              }}
            >
              <FaPlus />
            </Box>{' '}
            Neue Gruppe erstellen
          </Button>
        </Flex>
      )}
      <CreateGroupModal
        stage={currentStage}
        isOpen={isCreateGroupOpen}
        onClose={() => setCreateGroupIsOpen(false)}
      />
      <ModifyGroupModal
        group={currentGroup}
        isOpen={isModifyGroupOpen}
        onClose={() => setModifyGroupIsOpen(false)}
      />
      <InviteModal
        stage={currentStage}
        group={currentGroup}
        onClose={() => setCopyLinkOpen(false)}
        isOpen={isCopyLinkOpen}
      />
    </Box>
  );
};

export default StageGroupList;
