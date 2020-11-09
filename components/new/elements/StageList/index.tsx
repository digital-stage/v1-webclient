/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import {
  jsx,
  Grid,
  Box,
  Divider,
  Flex,
  Button,
  IconButton,
  Heading,
} from 'theme-ui';
import {
  FaPlus,
  FaPen,
  FaTrash,
  FaChevronDown,
  FaChevronLeft,
} from 'react-icons/fa';
import {
  Groups,
  NormalizedState,
} from '../../../../lib/digitalstage/useStageContext/schema';
import { useSelector } from '../../../../lib/digitalstage/useStageContext/redux';
import useStageActions from '../../../../lib/digitalstage/useStageActions';
import { Client } from '../../../../lib/digitalstage/common/model.client';
import { useRequest } from '../../../../lib/useRequest';
import InviteModal from './InviteModal';
import ModifyStageModal from './ModifyStageModal';
import ModifyGroupModal from './ModifyGroupModal';
import CreateGroupModal from './CreateGroupModal';
import useStageSelector, {
  useStages,
} from '../../../../lib/digitalstage/useStageSelector';
import Card from '../../../Card';
import StageOverviewLinks from '../../../StageOverviewLinks';

/**  TODO: WORK in PROGRESS POC */

const StageListView = () => {
  const stages = useStages();
  const groups = useStageSelector<Groups>((state) => state.groups);
  const currentStageId = useSelector<NormalizedState, string | undefined>(
    (state) => state.stageId,
  );
  const currentGroupId = useSelector<NormalizedState, string | undefined>(
    (state) => state.groupId,
  );
  const {
    removeStage,
    removeGroup,
    leaveStage,
    leaveStageForGood,
  } = useStageActions();
  const { setRequest } = useRequest();
  const [currentStage, setCurrentStage] = React.useState<Client.Stage>();
  const [currentGroup, setCurrentGroup] = React.useState<Client.Group>();
  const [isCreateGroupOpen, setCreateGroupIsOpen] = React.useState<boolean>(
    false,
  );
  const [isModifyGroupOpen, setModifyGroupIsOpen] = React.useState<boolean>(
    false,
  );

  const [isModifyStageOpen, setModifyStageIsOpen] = React.useState<boolean>(
    false,
  );
  const [isCopyLinkOpen, setCopyLinkOpen] = React.useState<boolean>();

  return (
    <Card>

      <StageOverviewLinks />
      {/**  TODO: WORK in PROGRESS */}
      <Flex sx={{ flexDirection: 'column' }}>
        {stages.map((stage) => (
          <Box>
            <Box sx={{ width: '100%', py: '24px' }}>
              <Flex key={stage._id} sx={{ justifyContent: 'space-between' }}>
                <Box bg="primary">Box</Box>
                <Heading
                  as="h3"
                  sx={{ color: 'gray.0', flexBasis: 'max-content' }}
                >
                  {stage.name}
                </Heading>

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
                    aria-label={
                      stage.isAdmin ? 'Bühne entfernen' : 'Bühne verlassen'
                    }
                    onClick={() => {
                      if (stage.isAdmin) removeStage(stage._id);
                      else leaveStageForGood(stage._id);
                    }}
                  >
                    <FaTrash />
                  </IconButton>
                  <IconButton
                    aria-label={
                      stage.isAdmin ? 'Bühne entfernen' : 'Bühne verlassen'
                    }
                    onClick={() => {
                      if (stage.isAdmin) removeStage(stage._id);
                      else leaveStageForGood(stage._id);
                    }}
                  >
                    <FaChevronLeft />
                  </IconButton>
                </Box>
              </Flex>
            </Box>
            <Box sx={{ bg: 'gray.5', mx: '-32px', px: '48px' }}>

              {groups.byStage[stage._id]
              && groups.byStage[stage._id].map((groupId) => {
                console.log(groupId);
                const group = groups.byId[groupId];

                return (
                  <ul>
                    <li>
                      {group.name}

                      {stage.isAdmin && (
                        <React.Fragment>
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
                        </React.Fragment>
                      )}

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
                            currentStageId
                            && stage._id === currentStageId
                            && group._id === currentGroupId
                          ) {
                            leaveStage();
                          } else {
                            setRequest(stage._id, group._id, stage.password);
                          }
                        }}
                      >
                        {currentStageId
                        && stage._id === currentStageId
                        && group._id === currentGroupId
                          ? 'Verlassen'
                          : 'Betreten'}
                      </Button>

                    </li>
                  </ul>
                );
              })}

              {stage.isAdmin && (
              <Flex>
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
                  </Box>
                  {' '}
                  Neue Gruppe erstellen
                </Button>
              </Flex>
              )}
            </Box>
            <Divider sx={{ color: 'gray.2' }} />
          </Box>
        ))}
      </Flex>

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
      <ModifyStageModal
        stage={currentStage}
        isOpen={isModifyStageOpen}
        onClose={() => setModifyStageIsOpen(false)}
      />
      <InviteModal
        stage={currentStage}
        group={currentGroup}
        onClose={() => setCopyLinkOpen(false)}
        isOpen={isCopyLinkOpen}
      />
    </Card>
  );
};

export default StageListView;
