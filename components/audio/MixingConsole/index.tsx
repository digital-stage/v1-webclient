import useStageSelector from "../../../lib/digitalstage/useStageSelector";
import {CustomGroups, Groups} from "../../../lib/digitalstage/useStageContext/schema";
import {styled} from "baseui";
import {H2} from "../../theme/typography/Headline";
import React, {useEffect} from "react";
import useStageActions from "../../../lib/digitalstage/useStageActions";
import Slider from '@material-ui/core/Slider';
import {Checkbox} from "baseui/checkbox";

const Console = styled("div", {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    overflowX: "scroll"
})
const TrackRow = styled("div", ({$theme}) => ({
    width: "300px",
    height: "100vh",
    backgroundColor: $theme.colors.background
}));
const TrackTitle = styled("div", {});

const MixingConsole = () => {
    const {updateGroup, addCustomGroup, updateCustomGroup, removeCustomGroup} = useStageActions();
    const stageId = useStageSelector<string>(state => state.stageId);
    const groups = useStageSelector<Groups>(state => state.groups);
    const customGroups = useStageSelector<CustomGroups>(state => state.customGroups);
    const isAdmin: boolean = useStageSelector(state => state.stageId ? state.stages.byId[state.stageId].isAdmin : false);

    useEffect(() => {
        console.log("Custom groups changed");
    }, [customGroups])

    if (stageId) {
        return (
            <Console>
                {groups.byStage[stageId].map(groupId => {
                    const group = groups.byId[groupId];

                    if (isAdmin) {
                        return (
                            <TrackRow>
                                <TrackTitle>
                                    <H2>{group.name} (global)</H2>
                                </TrackTitle>
                                <Slider
                                    orientation="vertical"
                                    value={group.volume}
                                    min={0}
                                    max={1}
                                    onChange={(e, v) => {
                                        if (!Array.isArray(v)) {
                                            updateGroup(group._id, {
                                                volume: v
                                            });
                                        }
                                    }}
                                />
                            </TrackRow>
                        )
                    }

                    return (
                        <TrackRow>
                            <TrackTitle>
                                <H2>{group.name} (custom)</H2>
                            </TrackTitle>
                            <p>
                                <Checkbox
                                    checked={customGroups.byGroup[groupId] !== undefined}
                                    onChange={() => {
                                        if (customGroups.byGroup[groupId])
                                            removeCustomGroup(customGroups.byGroup[groupId])
                                        else
                                            addCustomGroup(groupId, 1)
                                    }}
                                >
                                    Custom
                                </Checkbox>
                            </p>
                            {customGroups.byGroup[groupId] && (
                                <Slider
                                    orientation="vertical"
                                    value={customGroups.byId[customGroups.byGroup[groupId]].volume}
                                    step={0.05}
                                    min={0}
                                    max={1}
                                    onChange={(e, v) => {
                                        if (!Array.isArray(v)) {
                                            console.log("Set custom group volume to " + v)
                                            updateCustomGroup(customGroups.byId[customGroups.byGroup[groupId]]._id, v);
                                        }
                                    }}
                                />
                            )}
                            {isAdmin && (
                                <div>
                                    <Slider
                                        orientation="vertical"
                                        value={group.volume}
                                        min={0}
                                        max={1}
                                        onChange={(e, v) => {
                                            if (!Array.isArray(v)) {
                                                updateGroup(group._id, {
                                                    volume: v
                                                });
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </TrackRow>
                    )
                })}
            </Console>
        )
    }

    return null;
}
export default MixingConsole;