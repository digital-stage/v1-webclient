import React, {Reducer, useEffect, useReducer, useRef, useState} from 'react';
import {
    useAudioConsumers,
    useAudioProducers,
    useCurrentStageId,
    useCustomAudioProducers,
    useCustomGroups,
    useCustomStageMembers,
    useGroups,
    useStageMembersRaw,
} from '../use-digital-stage/hooks';
import useAudioContext from './../useAudioContext';
import debug from "debug";
import {AudioProducerNodesCollection, GainAudioNodeCollection, SingleRootNodes} from "./types";
import {AudioProducerNodesActions, audioProducerNodesReducer} from "./reducers/audioProducers";
import {StageMemberNodesActions, stageMemberNodesReducer} from "./reducers/stageMemberNodes";
import {GroupNodesActions, groupNodesReducer} from "./reducers/groupNodes";

const d = debug('useStageWebAudio');


export interface StageWebAudioProps {
    byGroup: GainAudioNodeCollection;
    byStageMember: GainAudioNodeCollection;
    byAudioProducer: AudioProducerNodesCollection;
}

const StageWebAudioContext = React.createContext<StageWebAudioProps>(undefined);

const useStageWebAudio = (): StageWebAudioProps => React.useContext<StageWebAudioProps>(StageWebAudioContext);


const StageWebAudioProvider = (props: {
    children: React.ReactNode;
    handleError: ((error: Error) => void) | undefined;
}): JSX.Element => {
    const {children, handleError} = props;
    const {audioContext} = useAudioContext();
    const audioPlayerRef = useRef<HTMLAudioElement>();
    const [destinationNodes, setDestinationNodes] = useState<SingleRootNodes>(undefined);

    // Incoming states from stage
    const stageId = useCurrentStageId();
    const groups = useGroups();
    const customGroups = useCustomGroups();
    const stageMembers = useStageMembersRaw();
    const customStageMembers = useCustomStageMembers();
    const audioProducers = useAudioProducers();
    const customAudioProducers = useCustomAudioProducers();
    const audioConsumers = useAudioConsumers();

    const [groupNodes, dispatchGroup] = useReducer<Reducer<GainAudioNodeCollection, GroupNodesActions>>(groupNodesReducer, {
        byId: {}
    });
    const [stageMemberNodes, dispatchStageMembers] = useReducer<Reducer<GainAudioNodeCollection, StageMemberNodesActions>>(stageMemberNodesReducer, {
        byId: {}
    });
    const [audioProducerNodes, dispatchAudioProducers] = useReducer<Reducer<AudioProducerNodesCollection, AudioProducerNodesActions>>(audioProducerNodesReducer, {
        byId: {}
    });

    /**
     * ROOT NODES
     */
    useEffect(() => {
        if (audioContext && handleError && audioPlayerRef) {
            try {
                d("Creating both root nodes");
                // Create root node

                const splitter = audioContext.createChannelSplitter(2);
                const merger = audioContext.createChannelMerger(2);

                merger.connect(audioContext.destination);

                splitter.connect(merger, 0, 0);
                splitter.connect(merger, 0, 1);

                const createdRootNodeL = audioContext.createGain();
                createdRootNodeL.connect(audioContext.destination);
                const createdRootNodeR = audioContext.createGain();
                createdRootNodeR.connect(audioContext.destination);

                setDestinationNodes({
                    rootNodes: {
                        left: createdRootNodeL, right: createdRootNodeR
                    }
                });
            } catch (error) {
                handleError(error);
            }
            return () => {
                d('Removing and disconnecting both root nodes');
                if (destinationNodes) {
                    destinationNodes.rootNodes.left.disconnect();
                    destinationNodes.rootNodes.right.disconnect();
                    setDestinationNodes(undefined);
                }
            }
        }
    }, [audioContext, audioPlayerRef, handleError]);


    /**
     * GROUP AUDIO NODES
     */
    useEffect(() => {
        if (destinationNodes && stageId && groups.byStage[stageId]) {
            d('Updating group nodes for stage ' + stageId);
            dispatchGroup({
                type: "CHANGED",
                groups: groups.byStage[stageId].map(id => groups.byId[id]),
                customGroups,
                targetNodes: destinationNodes
            });
        } else {
            d('Reset all group nodes');
            dispatchGroup({type: "RESET"})
        }
    }, [destinationNodes, stageId, groups, customGroups])


    /**
     * STAGE MEMBER AUDIO NODES
     */
    useEffect(() => {
        if (groupNodes && stageId && stageMembers.byStage[stageId]) {
            d('Updating stage member nodes for stage ' + stageId);
            dispatchStageMembers({
                type: "CHANGED",
                stageMembers: stageMembers.byStage[stageId].map(id => stageMembers.byId[id]),
                customStageMembers,
                targetNodes: groupNodes
            });
        } else {
            d('Reset all stage member nodes');
            dispatchStageMembers({type: "RESET"})
        }
    }, [groupNodes, stageId, stageMembers, customStageMembers])

    /**
     * AUDIO PRODUCER AUDIO NODES
     */
    useEffect(() => {
        if (stageMemberNodes && stageId && audioProducers.byStage[stageId]) {
                d('Updating audio producers nodes for stage ' + stageId);
                dispatchAudioProducers({
                    type: "CHANGED",
                    audioProducers: audioProducers.byStage[stageId].map(id => audioProducers.byId[id]),
                    customAudioProducers,
                    groups,
                    customGroups,
                    stageMembers,
                    customStageMembers,
                    targetNodes: stageMemberNodes,
                    audioConsumers
                });
        } else {
            d('Reset all audio producer nodes');
            dispatchAudioProducers({type: "RESET"})
        }
    }, [
        stageMemberNodes,
        stageId,
        audioProducers,
        customAudioProducers,
        audioConsumers,
        groups,
        customGroups,
        stageMembers,
        customStageMembers
    ]);

    return (
        <StageWebAudioContext.Provider
            value={{
                byGroup: groupNodes,
                byStageMember: stageMemberNodes,
                byAudioProducer: audioProducerNodes,
            }}
        >
            {children}
        </StageWebAudioContext.Provider>
    );
};

export {StageWebAudioProvider};

export default useStageWebAudio;
