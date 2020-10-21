import React, {useEffect, useRef, useState} from "react";
import {
    IAnalyserNode,
    IAudioContext, IAudioNode,
    IGainNode
} from "standardized-audio-context";
import useStageSelector from "./digitalstage/useStageSelector";
import {useAudioContext} from "./useAudioContext";
import {IMediaStreamAudioSourceNode} from "standardized-audio-context/src/interfaces/media-stream-audio-source-node";
import {
    AudioConsumers,
    AudioProducers,
    Groups,
    StageMembers
} from "./digitalstage/useStageContext/schema";

export interface StageWebAudioNodes {
    [id: string]: {
        sourceNode: IAudioNode<IAudioContext>,
        gainNode: IGainNode<IAudioContext>,
        analyserNode: IAnalyserNode<IAudioContext>
    }
}

export interface StageWebAudioConsumerNodes {
    [id: string]: {
        sourceNode?: IMediaStreamAudioSourceNode<IAudioContext>,
        element?: HTMLAudioElement,
        gainNode: IGainNode<IAudioContext>,
        analyserNode: IAnalyserNode<IAudioContext>,
    }
}

export interface StageWebAudioProps {
    byGroup: StageWebAudioNodes,
    byStageMember: StageWebAudioNodes,
    byAudioProducer: StageWebAudioConsumerNodes
}

const StageWebAudioContext = React.createContext<StageWebAudioProps>(undefined);

export const useStageWebAudio = () => React.useContext(StageWebAudioContext);

const StageWebAudioProvider = (
    props: {
        children: React.ReactNode
    }
) => {
    const {audioContext} = useAudioContext();
    const audioPlayerRef = useRef<HTMLAudioElement>();
    const [rootGainNode, setRootGainNode] = useState<IGainNode<IAudioContext>>();
    const [rootNode, setRootNode] = useState<IAudioNode<IAudioContext>>();
    const [groupNodes, setGroupNodes] = useState<StageWebAudioNodes>({});
    const [stageMemberNodes, setStageMemberNodes] = useState<StageWebAudioNodes>({});
    const [audioProducerNodes, setAudioProducerNodes] = useState<StageWebAudioConsumerNodes>({});

    // Incoming states from stage
    const stageId = useStageSelector<string>(state => state.stageId);
    const groups = useStageSelector<Groups>(state => state.groups);
    const stageMembers = useStageSelector<StageMembers>(state => state.stageMembers);
    const audioProducers = useStageSelector<AudioProducers>(state => state.audioProducers);
    const audioConsumers = useStageSelector<AudioConsumers>(state => state.audioConsumers);

    useEffect(() => {
        if (audioContext && audioPlayerRef && !rootNode) {
            // Create root node

            const rootGainNode = audioContext.createGain();
            rootGainNode.gain.value = 1;
            rootGainNode.connect(audioContext.destination);

            const rootNode = audioContext.createChannelMerger();
            rootNode.connect(rootGainNode);

            setRootGainNode(rootGainNode);
            setRootNode(rootNode);

            //const dest = audioContext.createMediaStreamDestination();
            //rootNode.connect(dest);
            //audioPlayerRef.current.srcObject = dest.stream;
        }
    }, [audioContext, audioPlayerRef]);

    useEffect(() => {
        if (audioContext && rootNode) {
            if (stageId && groups.byStage[stageId]) {
                console.log("update groups");

                setGroupNodes(prev => {
                    Object.keys(prev).forEach(id => {
                        console.log("Checking " + id);
                        if (!groups.byId[id]) {
                            prev[id].sourceNode.disconnect();
                            prev[id].gainNode.disconnect();
                            prev[id].analyserNode.disconnect();
                        }
                    });

                    const state = groups.byStage[stageId].reduce((items, id) => {
                        console.log("Adding item " + id);
                        const item = groups.byId[id];
                        if (!prev[id]) {
                            // Create nodes
                            const sourceNode = audioContext.createChannelMerger();
                            const gainNode = audioContext.createGain();
                            gainNode.gain.value = item.volume;
                            const analyserNode = audioContext.createAnalyser();
                            sourceNode.connect(gainNode);
                            gainNode.connect(analyserNode);
                            gainNode.connect(rootNode);
                            return {
                                ...items,
                                [item._id]: {
                                    sourceNode: sourceNode,
                                    gainNode: gainNode,
                                    analyserNode: analyserNode
                                }
                            }
                        } else {

                            if (prev[item._id].gainNode.gain.value !== item.volume) {
                                console.log("Set GROUP value to " + item.volume)
                                prev[item._id].gainNode.gain.setValueAtTime(item.volume, audioContext.currentTime);
                            }

                            return {
                                ...items,
                                [item._id]: prev[item._id]
                            };
                        }
                    }, {});
                    console.log(state);
                    return state;
                });
            } else {
                setGroupNodes(prev => {
                    Object.keys(prev).forEach(id => {
                        prev[id].sourceNode.disconnect();
                        prev[id].gainNode.disconnect();
                        prev[id].analyserNode.disconnect();
                    });
                    return {}
                });
            }
        }
    }, [audioContext, rootNode, stageId, groups])

    useEffect(() => {
        if (audioContext) {
            if (stageId && stageMembers.byStage[stageId]) {
                // Create for each group node an audio player
                setStageMemberNodes(prev => {
                    // Clean up old nodes
                    Object.keys(prev).forEach(id => {
                        if (!stageMembers.byId[id]) {
                            prev[id].sourceNode.disconnect();
                            prev[id].gainNode.disconnect();
                            prev[id].analyserNode.disconnect();
                        }
                    });

                    return stageMembers.byStage[stageId].reduce((items, id) => {
                        const item = stageMembers.byId[id];
                        if (groupNodes[item.groupId]) {
                            if (!prev[item._id]) {
                                // Create nodes
                                const sourceNode = audioContext.createChannelMerger();
                                const gainNode = audioContext.createGain();
                                gainNode.gain.setValueAtTime(item.volume, audioContext.currentTime);
                                const analyserNode = audioContext.createAnalyser();
                                sourceNode.connect(gainNode);
                                gainNode.connect(analyserNode);
                                gainNode.connect(groupNodes[item.groupId].sourceNode);
                                return {
                                    ...items,
                                    [item._id]: {
                                        sourceNode: sourceNode,
                                        gainNode: gainNode,
                                        analyserNode: analyserNode
                                    }
                                }
                            } else {
                                if (prev[item._id].gainNode.gain.value !== item.volume) {
                                    console.log("Set stage member " + item._id + " volume to " + item.volume);
                                    prev[item._id].gainNode.gain.setValueAtTime(item.volume, audioContext.currentTime);
                                }
                                return {
                                    ...items,
                                    [item._id]: prev[item._id]
                                };
                            }
                        }
                        return items;
                    }, {});
                })
            } else {
                setStageMemberNodes(prev => {
                    Object.keys(prev).forEach(id => {
                        prev[id].sourceNode.disconnect();
                        prev[id].gainNode.disconnect();
                        prev[id].analyserNode.disconnect();
                    });
                    return {}
                });
            }
        }
    }, [audioContext, stageId, groupNodes, stageMembers]);

    useEffect(() => {
        if (audioContext) {
            if (stageId && audioProducers.byStage[stageId]) {
                // Create for each group node an audio player
                setAudioProducerNodes(prev => {
                    // Clean up old nodes
                    Object.keys(prev).forEach(id => {
                        if (!audioProducers.byId[id]) {
                            if (prev[id].sourceNode)
                                prev[id].sourceNode.disconnect();
                            prev[id].gainNode.disconnect();
                            prev[id].analyserNode.disconnect();
                        }
                    });
                    return audioProducers.byStage[stageId].reduce((items, id) => {
                        const item = audioProducers.byId[id];
                        if (stageMemberNodes[item.stageMemberId]) {
                            let gainNode;
                            let analyserNode;
                            let sourceNode;
                            let element;
                            if (!prev[item._id]) {
                                gainNode = audioContext.createGain();
                                gainNode.gain.value = 1;
                                //gainNode.gain.setValueAtTime(item.volume, audioContext.currentTime);
                                analyserNode = audioContext.createAnalyser();
                                gainNode.connect(analyserNode);
                                gainNode.connect(stageMemberNodes[item.stageMemberId].sourceNode);
                            } else {
                                gainNode = prev[item._id].gainNode;
                                analyserNode = prev[item._id].analyserNode;
                                if (gainNode.gain.value !== item.volume) {
                                    console.log("Set producer " + item._id + " volume to " + item.volume);
                                    gainNode.gain.setValueAtTime(item.volume, audioContext.currentTime);
                                }
                            }
                            if ((!prev[item._id] || !prev[item._id].sourceNode) && audioConsumers.byProducer[item._id]) {
                                // See, if there is a consumer
                                const audioConsumer = audioConsumers.byId[audioConsumers.byProducer[item._id]];
                                const stream = new MediaStream([audioConsumer.msConsumer.track]);

                                element = new Audio();
                                element.srcObject = stream;
                                element.autoplay = true;
                                element.muted = true;
                                element.play();

                                //sourceNode = audioContext.createMediaElementSource(element);
                                //sourceNode.connect(gainNode);

                                sourceNode = audioContext.createMediaStreamSource(stream);
                                sourceNode.connect(gainNode);
                            }
                            return {
                                ...items,
                                [item._id]: {
                                    gainNode: gainNode,
                                    analyserNode: analyserNode,
                                    sourceNode: sourceNode,
                                    element: element
                                }
                            };
                        }
                        return items;
                    }, {});
                })
            } else {
                setAudioProducerNodes(prev => {
                    Object.keys(prev).forEach(id => {
                        if (prev[id].sourceNode)
                            prev[id].sourceNode.disconnect();
                        prev[id].gainNode.disconnect();
                        prev[id].analyserNode.disconnect();
                    });
                    return {}
                });
            }
        }
    }, [audioContext, stageMemberNodes, audioProducers, audioConsumers.byProducer]);

    return (
        <StageWebAudioContext.Provider value={{
            byGroup: groupNodes,
            byStageMember: stageMemberNodes,
            byAudioProducer: audioProducerNodes
        }}>
            {props.children}
        </StageWebAudioContext.Provider>
    )
}
export default StageWebAudioProvider;