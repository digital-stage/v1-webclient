import {
  CustomStageMembersCollection,
  StageMember,
  ThreeDimensionAudioProperties,
} from '../../use-digital-stage/types';
import { GainAudioNodeCollection, MultipleRootNodes, SingleRootNodes } from '../types';
import debug from 'debug';
import { createGainAudioNode, disconnectGainAudioNode, updateGainAudioNode } from './utils';

const d = debug('useStageWebAudio:reducer:stageMembers');

interface StageMemberChangedAction {
  type: 'CHANGED';
  stageMembers: StageMember[];
  customStageMembers: CustomStageMembersCollection;
  targetNodes: MultipleRootNodes;
}

interface ResetAction {
  type: 'RESET';
}

export type StageMemberNodesActions = StageMemberChangedAction | ResetAction;

export function stageMemberNodesReducer(
  prev: GainAudioNodeCollection = {
    byId: {},
  },
  action: StageMemberNodesActions
): GainAudioNodeCollection {
  switch (action.type) {
    case 'CHANGED':
      // Remove nodes for obsolete groups
      const state: GainAudioNodeCollection = {
        byId: {},
      };
      Object.keys(prev.byId).forEach((id) => {
        if (!action.stageMembers.find((item) => item._id === id)) {
          // Group does not exist any more, disconnect nodes
          disconnectGainAudioNode(prev.byId[id]);
          // And don't assign it to new state
        } else {
          // Assign existing group nodes to new state
          state.byId[id] = prev.byId[id];
        }
      });
      action.stageMembers.forEach((item) => {
        d('Handling stage member ' + item._id);
        const targetNodes: SingleRootNodes = action.targetNodes.byId[item.groupId];
        if (targetNodes) {
          d('Have group nodes for stage member ' + item._id);
          const customItem: ThreeDimensionAudioProperties = action.customStageMembers.byStageMember[
            item._id
          ]
            ? action.customStageMembers.byId[action.customStageMembers.byStageMember[item._id]]
            : undefined;
          // Target node is available
          if (!state.byId[item._id]) {
            // Create nodes for this new item
            d('Creating gain node for stage member ' + item._id);
            state.byId[item._id] = createGainAudioNode(targetNodes, item, customItem);
          } else {
            // Update nodes of this item
            d('Updating gain node for stage member ' + item._id);
            state.byId[item._id] = updateGainAudioNode(
              targetNodes,
              state.byId[item._id],
              item,
              customItem
            );
          }
        }
      });
      return state;
    case 'RESET':
      Object.keys(prev.byId).forEach((id) => {
        d('Reset nodes of group ' + id);
        disconnectGainAudioNode(prev[id]);
      });
      return {
        byId: {},
      };
    default:
      throw new Error();
  }
}
