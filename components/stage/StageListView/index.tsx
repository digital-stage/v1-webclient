import {styled} from "baseui";
import React, {useState} from "react";
import {Button} from "baseui/button/index";
import {Accordion, Panel} from "baseui/accordion/index";
import {useStages, useStageSelector} from "../../../lib/digitalstage/useStages";
import {Plus} from "baseui/icon/index";
import CreateGroupModal from "./CreateGroupModal";
import CreateStageModal from "./CreateStageModal";
import ModifyGroupModal from "./ModifyGroupModal";
import ModifyStageModal from "./ModifyStageModal";
import {Tag} from "baseui/tag";
import InviteModal from "./InviteModal";
import {useRequest} from "../../../lib/useRequest";
import {Client} from "../../../lib/digitalstage/common/model.client";

const Label = styled("div", {})
const GlobalActions = styled("div", {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
})
const StageTitle = styled("div", {
    width: '100%',
});
const StageTopActions = styled("div", ({$theme}) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    borderBottomColor: 'rgb(203, 203, 203)',
    backgroundColor: $theme.colors.primary100
}));
const StageBottomActions = styled("div", {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: '1rem'
});
const GroupRow = styled("div", {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    borderBottomColor: 'rgb(203, 203, 203)'
});
const GroupTitle = styled("div", {
    display: 'flex',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    alignItems: 'center',
    flexGrow: 2
})
const GroupActions = styled("div", {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    flexGrow: 1
});
const GroupAdminActions = styled("div", {
    display: 'flex',
    paddingLeft: '1rem'
})

const StageListView = () => {
    const {stages, groups, current} = useStageSelector((state) => {
        return {
            stages: state.stages,
            groups: state.groups,
            current: state.current
        };
    });
    const {removeStage, removeGroup, leaveStage, leaveStageForGood} = useStages();
    const {setRequest} = useRequest();
    const [currentStage, setCurrentStage] = useState<Client.Stage>();
    const [currentGroup, setCurrentGroup] = useState<Client.Group>();
    const [isCreateGroupOpen, setCreateGroupIsOpen] = useState<boolean>(false);
    const [isModifyGroupOpen, setModifyGroupIsOpen] = useState<boolean>(false);
    const [isCreateStageOpen, setCreateStageIsOpen] = useState<boolean>(false);
    const [isModifyStageOpen, setModifyStageIsOpen] = useState<boolean>(false);
    const [isCopyLinkOpen, setCopyLinkOpen] = useState<boolean>();


    return (
        <>
            <GlobalActions>
                <Button size="compact" shape="pill" startEnhancer={<Plus/>}
                        onClick={() => setCreateStageIsOpen(prevState => !prevState)}>
                    Neue Bühne hinzufügen
                </Button>
            </GlobalActions>
            <Accordion>
                {stages.allIds.map(stageId => {
                    const stage = stages.byId[stageId];
                    return (
                        <Panel
                            key={stage._id}
                            title={(
                                <StageTitle>
                                    {stage.name}
                                </StageTitle>
                            )}
                        >
                            <StageTopActions>
                                {stage.isAdmin ? (
                                    <>
                                        <Tag
                                            closeable={false}
                                            kind="accent"
                                            onClick={() => {
                                                setCurrentStage(stage);
                                                setModifyStageIsOpen(true)
                                            }}
                                        >
                                            Bühne ändern
                                        </Tag>
                                        <Tag
                                            closeable={false}
                                            kind="negative"
                                            onClick={() => removeStage(stage._id)}
                                        >
                                            Bühne entfernen
                                        </Tag>
                                    </>
                                ) : (
                                    <Tag
                                        closeable={false}
                                        kind="negative"
                                        onClick={() => leaveStageForGood(stage._id)}
                                    >
                                        Bühne entgültig verlassen
                                    </Tag>
                                )}
                            </StageTopActions>
                            {stage.groups.map(groupId => {
                                const group = groups.byId[groupId];
                                return (
                                    <GroupRow key={group._id}>
                                        <GroupTitle>
                                            <Label>{group.name}</Label>

                                            {stage.isAdmin && (
                                                <GroupAdminActions>
                                                    <Tag
                                                        closeable={false}
                                                        kind="accent"
                                                        onClick={() => {
                                                            setCurrentGroup(group);
                                                            setModifyGroupIsOpen(true);
                                                        }}
                                                    >
                                                        Gruppe ändern
                                                    </Tag>
                                                    <Tag
                                                        closeable={false}
                                                        kind="negative"
                                                        onClick={() => removeGroup(group._id)}
                                                    >
                                                        Gruppe entfernen
                                                    </Tag>
                                                </GroupAdminActions>
                                            )}
                                        </GroupTitle>
                                        <GroupActions>
                                            <Tag
                                                size="large"
                                                closeable={false}
                                                kind={current && stage._id === current.stageId && group._id === current.groupId ? "orange" : "positive"}
                                                onClick={() => {
                                                    if (current && stage._id === current.stageId && group._id === current.groupId) {
                                                        leaveStage();
                                                    } else {
                                                        console.log("Request");
                                                        setRequest(stage._id, group._id, stage.password);
                                                    }
                                                }}
                                            >
                                                {current && stage._id === current.stageId && group._id === current.groupId ? "Verlassen" : "Beitreten"}
                                            </Tag>
                                            <Tag
                                                size="large"
                                                closeable={false}
                                                onClick={() => {
                                                    setCurrentStage(stage);
                                                    setCurrentGroup(group);
                                                    setCopyLinkOpen(prevState => !prevState);
                                                }}
                                            >
                                                Einladen
                                            </Tag>
                                        </GroupActions>
                                    </GroupRow>
                                )
                            })}
                            {stage.isAdmin && (
                                <StageBottomActions>
                                    <Button
                                        size="mini" shape="pill"
                                        startEnhancer={<Plus/>}
                                        onClick={() => {
                                            setCurrentStage(stage);
                                            setCreateGroupIsOpen(true)
                                        }}>
                                        Neue Gruppe hinzufügen
                                    </Button>
                                </StageBottomActions>
                            )}
                        </Panel>
                    )
                })}
            </Accordion>
            <CreateStageModal isOpen={isCreateStageOpen}
                              onClose={() => setCreateStageIsOpen(false)}/>
            <CreateGroupModal stage={currentStage} isOpen={isCreateGroupOpen}
                              onClose={() => setCreateGroupIsOpen(false)}/>
            <ModifyGroupModal group={currentGroup} isOpen={isModifyGroupOpen}
                              onClose={() => setModifyGroupIsOpen(false)}/>
            <ModifyStageModal stage={currentStage} isOpen={isModifyStageOpen}
                              onClose={() => setModifyStageIsOpen(false)}/>
            <InviteModal stage={currentStage} group={currentGroup} onClose={() => setCopyLinkOpen(false)}
                         isOpen={isCopyLinkOpen}/>
        </>
    )
}
export default StageListView;