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
import { Accordion, Panel } from 'baseui/accordion';
import { ListItem, ListItemLabel } from 'baseui/list';
import {
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

{ /**  TODO: WORK in PROGRESS POC */ }
const Accordion2 = ({ children }) => (
  <Flex
    sx={{
      flexDirection: 'column',
      height: '72px',
    }}
  >
    {children}
  </Flex>
);

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
      <Accordion2>
        {stages.map((stage) => (
          <React.Fragment>
            <Box sx={{ width: '100%', py: '24px' }}>
              <Flex key={stage._id} sx={{ justifyContent: 'space-between' }}>
                <Box bg="primary">Box</Box>
                <Heading
                  as="h3"
                  sx={{ color: 'gray.0', flexBasis: 'max-content' }}
                >
                  {stage.name}
                </Heading>

                <Box bg="primary">
                  <IconButton
                    aria-label="edit"
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
            <Divider sx={{ color: 'gray.2' }} />
          </React.Fragment>
        ))}
      </Accordion2>

      <Accordion>
        {stages.map((stage) => (
          <Panel title={stage.name} key={stage._id}>
            {stage.isAdmin && (
              <Flex>
                <Button
                  aria-label="Gruppe hinzufügen"
                  variant="secondary"
                  onClick={() => {
                    setCurrentStage(stage);
                    setCreateGroupIsOpen(true);
                  }}
                >
                  Plus Icon - Gruppe hinzufügen
                </Button>
                <Button
                  variant="white"
                  aria-label="edit"
                  onClick={() => {
                    setCurrentStage(stage);
                    setModifyStageIsOpen(true);
                  }}
                >
                  Overflow Icon - Edit Stage
                </Button>
              </Flex>
            )}

            {groups.byStage[stage._id]
              && groups.byStage[stage._id].map((groupId) => {
                const group = groups.byId[groupId];

                return (
                  <ul>
                    <li>
                      {group.name}
                      <Button
                        kind={
                          currentStageId
                          && stage._id === currentStageId
                          && group._id === currentGroupId
                            ? 'primary'
                            : 'minimal'
                        }
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
                          : 'Beitreten'}
                      </Button>
                      <Button
                        onClick={() => {
                          setCurrentStage(stage);
                          setCurrentGroup(group);
                          setCopyLinkOpen((prevState) => !prevState);
                        }}
                      >
                        Einladen
                      </Button>

                      {stage.isAdmin && (
                        <React.Fragment>
                          <Button
                            variant="white"
                            onClick={() => {
                              setCurrentStage(stage);
                              setCurrentGroup(group);
                              setModifyGroupIsOpen((prevState) => !prevState);
                            }}
                          >
                            Edit Group
                          </Button>
                          <Button
                            variant="white"
                            onClick={() => {
                              removeGroup(group._id);
                            }}
                          >
                            Remove Group
                          </Button>
                        </React.Fragment>
                      )}
                    </li>
                  </ul>
                );
              })}

            <Button
              aria-label={stage.isAdmin ? 'Bühne entfernen' : 'Bühne verlassen'}
              onClick={() => {
                if (stage.isAdmin) removeStage(stage._id);
                else leaveStageForGood(stage._id);
              }}
            >
              Delete Icon - Bühne entfernen/verlassen
            </Button>
          </Panel>
        ))}
      </Accordion>

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
