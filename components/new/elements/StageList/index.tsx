import { styled } from 'baseui';
import React, { useState } from 'react';
import { Button } from 'baseui/button';
import { Accordion, Panel } from 'baseui/accordion';
import { ListItem, ListItemLabel } from 'baseui/list';
import { Delete, Overflow, Plus } from 'baseui/icon';
import { Groups, NormalizedState } from '../../../../lib/digitalstage/useStageContext/schema';
import { useSelector } from '../../../../lib/digitalstage/useStageContext/redux';
import useStageActions from '../../../../lib/digitalstage/useStageActions';
import { Client } from '../../../../lib/digitalstage/common/model.client';
import { useRequest } from '../../../../lib/useRequest';
import InviteModal from './InviteModal';
import ModifyStageModal from './ModifyStageModal';
import ModifyGroupModal from './ModifyGroupModal';
import CreateStageModal from './CreateStageModal';
import CreateGroupModal from './CreateGroupModal';
import useStageSelector, { useStages } from '../../../../lib/digitalstage/useStageSelector';
import { SECONDARY } from '../../../../uikit/Theme';

const Wrapper = styled('div', ({ $theme }) => ({
  display: 'block',
  backgroundColor: $theme.colors.backgroundPrimary,
  boxShadow: '0px 23px 17px #00000052',
  paddingTop: '1rem',
  paddingBottom: '1rem',
  borderRadius: '18px',
}));

const PanelHeader = styled('div', {
  width: '100%',
  display: 'flex',
  alignItems: 'space-between',
});
const PanelHeaderTitle = styled('div', {
  display: 'flex',
  flexGrow: 1,
  alignItems: 'center',
});
const PanelHeaderActions = styled('div', {
  display: 'flex',
  flexGrow: 0,
});

const GroupLine = styled('div', {
  display: 'flex',
  alignItems: 'space-between',
  width: '100%',
});
const GroupTitle = styled('div', {
  display: 'flex',
  flexGrow: 1,
  alignItems: 'center',
});
const GroupActions = styled('div', {
  display: 'flex',
  flexGrow: 0,
});

const StageList = () => {
  const stages = useStages();
  const groups = useStageSelector<Groups>((state) => state.groups);
  const currentStageId = useSelector<NormalizedState, string | undefined>((state) => state.stageId);
  const currentGroupId = useSelector<NormalizedState, string | undefined>((state) => state.groupId);
  const {
    removeStage, removeGroup, leaveStage, leaveStageForGood,
  } = useStageActions();
  const { setRequest } = useRequest();
  const [currentStage, setCurrentStage] = useState<Client.Stage>();
  const [currentGroup, setCurrentGroup] = useState<Client.Group>();
  const [isCreateGroupOpen, setCreateGroupIsOpen] = useState<boolean>(false);
  const [isModifyGroupOpen, setModifyGroupIsOpen] = useState<boolean>(false);
  const [isCreateStageOpen, setCreateStageIsOpen] = useState<boolean>(false);
  const [isModifyStageOpen, setModifyStageIsOpen] = useState<boolean>(false);
  const [isCopyLinkOpen, setCopyLinkOpen] = useState<boolean>();

  return (
    <>
      <Wrapper>
        <Button
          size="large"
          kind="primary"
          startEnhancer={<Plus />}
          onClick={() => setCreateStageIsOpen((prevState) => !prevState)}
        >
          Bühne hinzufügen
        </Button>
        <Accordion
          overrides={{
            Header: {
              style: ({ $theme }) => ({
                backgroundColor: $theme.colors.backgroundPrimary,
              }),
            },
            Content: {
              style: ({ $theme }) => ({
                backgroundColor: $theme.colors.mono1000,
              }),
            },

          }}
        >
          {stages.map((stage) => (
            <Panel
              title={(
                <PanelHeader>
                  <PanelHeaderTitle>
                    {stage.name}
                  </PanelHeaderTitle>
                  <PanelHeaderActions>
                    {stage.isAdmin ? (
                      <>
                        <Button
                          overrides={{
                            BaseButton: {
                              style: {
                                color: SECONDARY,
                              },
                            },
                          }}
                          kind="minimal"
                          shape="circle"
                          onClick={() => {
                            setCurrentStage(stage);
                            setModifyStageIsOpen(true);
                          }}
                        >
                          <img src="/static/icons/edit.svg" alt="Edit" />
                        </Button>
                        <Button
                          overrides={{
                            BaseButton: {
                              style: {
                                color: SECONDARY,
                              },
                            },
                          }}
                          kind="minimal"
                          shape="circle"
                          onClick={() => {
                            removeStage(stage._id);
                          }}
                        >
                          <img src="/static/icons/delete.svg" alt="Delete" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        overrides={{
                          BaseButton: {
                            style: {
                              color: SECONDARY,
                            },
                          },
                        }}
                        kind="minimal"
                        shape="circle"
                        onClick={() => {
                          leaveStageForGood(stage._id);
                        }}
                      >
                        <img src="/static/icons/delete.svg" alt="Delete" />
                      </Button>
                    )}
                  </PanelHeaderActions>
                </PanelHeader>
              )}
              key={stage._id}
            >
              {groups.byStage[stage._id] && groups.byStage[stage._id].map((groupId) => {
                const group = groups.byId[groupId];
                return (
                  <ListItem
                    key={groupId}
                  >
                    <GroupLine>
                      <GroupTitle>
                        {group.name}
                      </GroupTitle>
                      <GroupActions>
                        {stage.isAdmin && (
                        <>
                          <Button
                            shape="circle"
                            kind="minimal"
                            onClick={() => {
                              setCurrentStage(stage);
                              setCurrentGroup(group);
                              setModifyGroupIsOpen((prevState) => !prevState);
                            }}
                          >
                            <img src="/static/icons/edit.svg" alt="Edit" />
                          </Button>
                          <Button
                            shape="circle"
                            kind="minimal"
                            onClick={() => {
                              removeGroup(group._id);
                            }}
                          >
                            <img src="/static/icons/delete.svg" alt="Delete" />
                          </Button>
                        </>
                        )}
                        <Button
                          shape="pill"
                          kind="minimal"
                          onClick={() => {
                            setCurrentStage(stage);
                            setCurrentGroup(group);
                            setCopyLinkOpen((prevState) => !prevState);
                          }}
                        >
                          Invite
                        </Button>
                        <Button
                          shape="pill"
                          kind={currentStageId && stage._id === currentStageId && group._id === currentGroupId ? 'primary' : 'minimal'}
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
                          {currentStageId && stage._id === currentStageId && group._id === currentGroupId ? 'Leave' : 'Enter stage'}
                        </Button>
                      </GroupActions>
                    </GroupLine>
                  </ListItem>
                );
              })}

              {stage.isAdmin && (
                <>
                  <Button
                    kind="minimal"
                    onClick={() => {
                      setCurrentStage(stage);
                      setCreateGroupIsOpen(true);
                    }}
                    startEnhancer={<img src="/static/icons/add.svg" alt="Add group" />}
                  >
                    Create new group
                  </Button>
                </>
              )}
            </Panel>
          ))}
        </Accordion>

      </Wrapper>
      <CreateStageModal
        isOpen={isCreateStageOpen}
        onClose={() => setCreateStageIsOpen(false)}
      />
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
    </>
  );
};
export default StageList;
