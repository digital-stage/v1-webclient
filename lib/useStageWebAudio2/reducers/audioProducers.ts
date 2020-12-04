import {
    AudioProducerNode,
    AudioProducerNodesCollection,
    getTargetNodes, MultipleRootNodes,
    SingleRootNodes,
    TargetNodes,
} from "../types";
import {
    CustomGroupsCollection,
    CustomRemoteAudioProducersCollection, CustomStageMembersCollection, GroupsCollection,
    LocalConsumersCollection, RemoteAudioProducer, StageMembersCollection
} from "../../use-digital-stage/types";
import TreeDimensionPannerNode from "../TreeDimensionPannerNode";
import debug from "debug";
import {calculate3DAudioParameters} from "../utils";

const d = debug("useStageWebAudio:audioProducers:reducer");
const err = d.extend("error");


interface AudioProducersChangedAction {
    type: "CHANGED",
    audioProducers: RemoteAudioProducer[],
    customAudioProducers: CustomRemoteAudioProducersCollection,
    groups: GroupsCollection,
    customGroups: CustomGroupsCollection,
    stageMembers: StageMembersCollection,
    customStageMembers: CustomStageMembersCollection,
    audioConsumers: LocalConsumersCollection,
    targetNodes: MultipleRootNodes,
}

interface ResetAction {
    type: "RESET"
}

export type AudioProducerNodesActions = AudioProducersChangedAction | ResetAction;

const disconnectAudioProducerNode = (audioProducerNode: AudioProducerNode) => {
    try {
        audioProducerNode.gainNode.disconnect();
        audioProducerNode.analyserNode.disconnect();
        audioProducerNode.splitterNode.disconnect();
        audioProducerNode.pannerNode.disconnect();
    } catch (error) {
        err(error)
    }
};

export function audioProducerNodesReducer(prev: AudioProducerNodesCollection = {
    byId: {}
}, action: AudioProducerNodesActions): AudioProducerNodesCollection {
    switch (action.type) {
        case 'CHANGED':
            // Remove nodes for obsolete groups
            const state: AudioProducerNodesCollection = {
                byId: {}
            };
            Object.keys(prev.byId).forEach((id) => {
                if (!action.audioProducers.find(item => item._id === id)) {
                    // Group does not exist any more, disconnect nodes
                    disconnectAudioProducerNode(prev.byId[id]);
                    // And don't assign it to new state
                } else {
                    // Assign existing group nodes to new state
                    state.byId[id] = prev.byId[id];
                }
            });
            action.audioProducers.forEach(audioProducer => {
                d('Handling audio producer ' + audioProducer._id);
                const targetNodes: SingleRootNodes = action.targetNodes.byId[audioProducer.stageMemberId];
                if (targetNodes) {
                    d('Have stage member nodes for audio producer node ' + audioProducer._id);
                    const audioContext = targetNodes.rootNodes.left.context;
                    const customAudioProducer = action.customAudioProducers.byAudioProducer[audioProducer._id]
                        ? action.customAudioProducers.byId[action.customAudioProducers.byAudioProducer[audioProducer._id]]
                        : undefined;
                    const audioConsumer = action.audioConsumers.byProducer[audioProducer._id] ? action.audioConsumers.byId[action.audioConsumers.byProducer[audioProducer._id]] : undefined;
                    // Target nodes are available
                    let node = state.byId[audioProducer._id];
                    if (!node) {
                        d('Creating audio producer node ' + audioProducer._id);
                        // Create nodes for this new item
                        const gainNode = audioContext.createGain();
                        gainNode.gain.value = 1;
                        // gainNode.gain.setValueAtTime(item.volume, audioContext.currentTime);
                        const analyserNode = audioContext.createAnalyser();
                        gainNode.connect(analyserNode);
                        const pannerNode = new TreeDimensionPannerNode(audioContext);
                        gainNode.connect(pannerNode.getNode());
                        const splitterNode = audioContext.createChannelSplitter(2);
                        pannerNode.connect(splitterNode);
                        splitterNode.connect(targetNodes.rootNodes.left, 0, 0);
                        splitterNode.connect(targetNodes.rootNodes.right, 0, 0);

                        node = {
                            gainNode,
                            pannerNode,
                            splitterNode,
                            analyserNode
                        } as AudioProducerNode;
                    }
                    // Check if audio consumer is attached
                    if (!node.element && audioConsumer) {
                        d('Assign consumer to audio producer node ' + audioProducer._id);
                        const stream = new MediaStream([audioConsumer.consumer.track]);
                        node.element = new Audio();
                        node.element.srcObject = stream;
                        node.element.autoplay = true;
                        node.element.muted = true;
                        node.element.play();
                    }
                    // Now update or set parameters
                    if (customAudioProducer) {
                        d('Prefer custom audio producer for params of ' + audioProducer._id);
                        if (customAudioProducer.muted) {
                            if (node.gainNode.gain.value !== 0) {
                                node.gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                            }
                        } else if (node.gainNode.gain.value !== customAudioProducer.volume) {
                            node.gainNode.gain.setValueAtTime(customAudioProducer.volume, audioContext.currentTime);
                        }
                    } else {
                        d('Use global audio producer for params of ' + audioProducer._id);
                        if (audioProducer.muted) {
                            if (node.gainNode.gain.value !== 0) {
                                node.gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                            }
                        } else if (node.gainNode.gain.value !== audioProducer.volume) {
                            node.gainNode.gain.setValueAtTime(audioProducer.volume, audioContext.currentTime);
                        }
                    }
                    const stageMember = action.stageMembers.byId[audioProducer.stageMemberId];
                    const customStageMember = action.customStageMembers.byStageMember[stageMember._id]
                        ? action.customStageMembers.byId[action.customStageMembers.byStageMember[stageMember._id]]
                        : undefined;
                    const group = action.groups.byId[stageMember.groupId];
                    const customGroup = action.customGroups.byGroup[stageMember.groupId]
                        ? action.customGroups.byId[action.customGroups.byGroup[stageMember.groupId]]
                        : undefined;
                    const params = calculate3DAudioParameters(
                        group,
                        customGroup,
                        stageMember,
                        customStageMember,
                        audioProducer
                    );
                    node.pannerNode.setPosition(params.x, params.y, params.z);
                    node.pannerNode.setOrientation(params.rX, params.rY, params.rZ);

                    state.byId[audioProducer._id] = node;
                }
            });
            d(state);
            return state;
        case 'RESET':
            Object.keys(prev.byId).forEach((id) => {
                d('Reset nodes of audio producer ' + id)
                disconnectAudioProducerNode(prev.byId[id]);
            });
            return {
                byId: {}
            };
        default:
            throw new Error();
    }
}
