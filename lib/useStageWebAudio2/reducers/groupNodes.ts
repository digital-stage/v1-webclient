import {
    CustomGroupsCollection,
    Group,
    ThreeDimensionAudioProperties
} from "../../use-digital-stage/types";
import {
    GainAudioNodeCollection,
    SingleRootNodes,
} from "../types";
import debug from "debug";
import {createGainAudioNode, disconnectGainAudioNode, updateGainAudioNode} from "./utils";

const d = debug("useStageWebAudio:reducer:groups");

interface GroupsChangedAction {
    type: "CHANGED",
    groups: Group[],
    customGroups: CustomGroupsCollection,
    targetNodes: SingleRootNodes
}

interface ResetAction {
    type: "RESET"
}

export type GroupNodesActions = GroupsChangedAction | ResetAction;

export function groupNodesReducer(prev: GainAudioNodeCollection = {
    byId: {}
}, action: GroupNodesActions): GainAudioNodeCollection {
    switch (action.type) {
        case 'CHANGED':
            // Remove nodes for obsolete groups
            const state: GainAudioNodeCollection = {
                byId: {}
            };
            Object.keys(prev.byId).forEach((id) => {
                if (!action.groups.find(item => item._id === id)) {
                    // Group does not exist any more, disconnect nodes
                    disconnectGainAudioNode(prev.byId[id]);
                    // And don't assign it to new state
                } else {
                    // Assign existing group nodes to new state
                    state.byId[id] = prev.byId[id];
                }
            });
            action.groups.forEach(item => {
                d('Handling group ' + item._id);
                const customItem: ThreeDimensionAudioProperties = action.customGroups.byGroup[item._id]
                    ? action.customGroups.byId[action.customGroups.byGroup[item._id]]
                    : undefined;
                // Target node is available
                if (!state.byId[item._id]) {
                    // Create nodes for this new item
                    d('Creating gain node for group ' + item._id);
                    state.byId[item._id] = createGainAudioNode(action.targetNodes, item, customItem);
                } else {
                    // Update nodes of this item
                    d('Updating gain node for group ' + item._id);
                    state.byId[item._id] = updateGainAudioNode(action.targetNodes, state.byId[item._id], item, customItem);

                }
            });
            return state;
        case 'RESET':
            Object.keys(prev.byId).forEach((id) => {
                d('Reset nodes of group ' + id)
                disconnectGainAudioNode(prev[id]);
            });
            return {
                byId: {}
            };
        default:
            throw new Error();
    }
}


