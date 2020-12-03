import React, { useEffect, useRef, useState } from 'react';
import { IAnalyserNode, IAudioContext, IAudioNode, IGainNode } from 'standardized-audio-context';

import { IMediaStreamAudioSourceNode } from 'standardized-audio-context/src/interfaces/media-stream-audio-source-node';
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
import TreeDimensionPannerNode from './TreeDimensionPannerNode';
import { calculate3DAudioParameters } from './utils';

export interface GainAudioNode {
  [id: string]: {
    gainNodeL: IGainNode<IAudioContext>;
    gainNodeR: IGainNode<IAudioContext>;
    analyserNodeL: IAnalyserNode<IAudioContext>;
    analyserNodeR: IAnalyserNode<IAudioContext>;
  };
}

export interface TrackAudioNode {
  [id: string]: {
    sourceNode?: IMediaStreamAudioSourceNode<IAudioContext>;
    element?: HTMLAudioElement;
    gainNode: IGainNode<IAudioContext>;
    analyserNode: IAnalyserNode<IAudioContext>;
    splitterNode: IAudioNode<IAudioContext>;
    pannerNode: TreeDimensionPannerNode;
  };
}

export interface StageWebAudioProps {
  byGroup: GainAudioNode;
  byStageMember: GainAudioNode;
  byAudioProducer: TrackAudioNode;
}

const StageWebAudioContext = React.createContext<StageWebAudioProps>(undefined);

const useStageWebAudio = () => React.useContext(StageWebAudioContext);

const StageWebAudioProvider = (props: {
  children: React.ReactNode;
  handleError: ((error: Error) => void) | undefined;
}) => {
  const { children, handleError } = props;
  const { audioContext } = useAudioContext();
  const audioPlayerRef = useRef<HTMLAudioElement>();
  const [rootNodeL, setRootNodeL] = useState<IAudioNode<IAudioContext>>();
  const [rootNodeR, setRootNodeR] = useState<IAudioNode<IAudioContext>>();
  const [groupNodes, setGroupNodes] = useState<GainAudioNode>({});
  const [stageMemberNodes, setStageMemberNodes] = useState<GainAudioNode>({});
  const [audioProducerNodes, setAudioProducerNodes] = useState<TrackAudioNode>({});

  // Incoming states from stage
  const stageId = useCurrentStageId();
  const groups = useGroups();
  const customGroups = useCustomGroups();
  const stageMembers = useStageMembersRaw();
  const customStageMembers = useCustomStageMembers();
  const audioProducers = useAudioProducers();
  const customAudioProducers = useCustomAudioProducers();
  const audioConsumers = useAudioConsumers();

  useEffect(() => {
    if (audioContext && audioPlayerRef && !rootNodeL && !rootNodeR) {
      try {
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

        setRootNodeL(createdRootNodeL);
        setRootNodeR(createdRootNodeR);

        // const dest = audioContext.createMediaStreamDestination();
        // rootNode.connect(dest);
        // audioPlayerRef.current.srcObject = dest.stream;
      } catch (error) {
        handleError(error);
      }
    }
  }, [audioContext, audioPlayerRef, handleError]);

  useEffect(() => {
    if (audioContext && rootNodeL && rootNodeR && handleError) {
      try {
        if (stageId && groups.byStage[stageId]) {
          setGroupNodes((prev) => {
            Object.keys(prev).forEach((id) => {
              if (!groups.byId[id]) {
                prev[id].gainNodeL.disconnect();
                prev[id].gainNodeR.disconnect();
                prev[id].analyserNodeL.disconnect();
                prev[id].analyserNodeR.disconnect();
              }
            });

            return groups.byStage[stageId].reduce((items, id) => {
              const item = groups.byId[id];
              const customItem = customGroups.byGroup[item._id]
                ? customGroups.byId[customGroups.byGroup[item._id]]
                : undefined;
              if (!prev[id]) {
                // Create nodes
                const gainNodeL = audioContext.createGain();
                const gainNodeR = audioContext.createGain();
                if (customItem) {
                  gainNodeL.gain.value = customItem.volume;
                  gainNodeR.gain.value = customItem.volume;
                } else {
                  gainNodeL.gain.value = item.volume;
                  gainNodeR.gain.value = item.volume;
                }
                const analyserNodeL = audioContext.createAnalyser();
                const analyserNodeR = audioContext.createAnalyser();
                gainNodeL.connect(analyserNodeL);
                gainNodeR.connect(analyserNodeR);
                gainNodeL.connect(rootNodeL);
                gainNodeR.connect(rootNodeR);
                return {
                  ...items,
                  [item._id]: {
                    gainNodeL,
                    gainNodeR,
                    analyserNodeL,
                    analyserNodeR,
                  },
                };
              }
              if (customItem) {
                if (customItem.muted) {
                  if (prev[item._id].gainNodeL.gain.value !== 0) {
                    prev[item._id].gainNodeL.gain.setValueAtTime(0, audioContext.currentTime);
                    prev[item._id].gainNodeR.gain.setValueAtTime(0, audioContext.currentTime);
                  }
                } else if (prev[item._id].gainNodeL.gain.value !== customItem.volume) {
                  prev[item._id].gainNodeL.gain.setValueAtTime(
                    customItem.volume,
                    audioContext.currentTime
                  );
                  prev[item._id].gainNodeR.gain.setValueAtTime(
                    customItem.volume,
                    audioContext.currentTime
                  );
                }
              } else {
                if (item.muted) {
                  if (prev[item._id].gainNodeL.gain.value !== 0) {
                    prev[item._id].gainNodeL.gain.setValueAtTime(0, audioContext.currentTime);
                    prev[item._id].gainNodeR.gain.setValueAtTime(0, audioContext.currentTime);
                  }
                } else if (prev[item._id].gainNodeL.gain.value !== item.volume) {
                  prev[item._id].gainNodeL.gain.setValueAtTime(
                    item.volume,
                    audioContext.currentTime
                  );
                  prev[item._id].gainNodeR.gain.setValueAtTime(
                    item.volume,
                    audioContext.currentTime
                  );
                }
              }

              return {
                ...items,
                [item._id]: prev[item._id],
              };
            }, {});
          });
        } else {
          setGroupNodes((prev) => {
            Object.keys(prev).forEach((id) => {
              prev[id].gainNodeL.disconnect();
              prev[id].gainNodeR.disconnect();
              prev[id].analyserNodeL.disconnect();
              prev[id].analyserNodeR.disconnect();
            });
            return {};
          });
        }
      } catch (error) {
        handleError(error);
      }
    }
  }, [audioContext, rootNodeL, rootNodeR, stageId, groups, customGroups, handleError]);

  useEffect(() => {
    if (audioContext) {
      if (audioContext && stageId && stageMembers.byStage[stageId] && handleError) {
        try {
          // Create for each group node an audio player
          setStageMemberNodes((prev) => {
            // Clean up old nodes
            Object.keys(prev).forEach((id) => {
              if (!stageMembers.byId[id]) {
                prev[id].gainNodeL.disconnect();
                prev[id].gainNodeR.disconnect();
                prev[id].analyserNodeL.disconnect();
                prev[id].analyserNodeR.disconnect();
              }
            });

            return stageMembers.byStage[stageId].reduce((items, id) => {
              const item = stageMembers.byId[id];
              const customItem = customStageMembers.byStageMember[item._id]
                ? customStageMembers.byId[customStageMembers.byStageMember[item._id]]
                : undefined;
              if (groupNodes[item.groupId]) {
                if (!prev[item._id]) {
                  // Create nodes
                  const gainNodeL = audioContext.createGain();
                  const gainNodeR = audioContext.createGain();
                  if (customItem && customItem.volume) {
                    gainNodeL.gain.value = customItem.volume;
                    gainNodeR.gain.value = customItem.volume;
                  } else if (item.volume) {
                    gainNodeL.gain.value = item.volume;
                    gainNodeR.gain.value = item.volume;
                  }
                  const analyserNodeL = audioContext.createAnalyser();
                  const analyserNodeR = audioContext.createAnalyser();
                  gainNodeL.connect(analyserNodeL);
                  gainNodeR.connect(analyserNodeR);
                  gainNodeL.connect(groupNodes[item.groupId].gainNodeL);
                  gainNodeR.connect(groupNodes[item.groupId].gainNodeR);
                  return {
                    ...items,
                    [item._id]: {
                      gainNodeL,
                      gainNodeR,
                      analyserNodeL,
                      analyserNodeR,
                    },
                  };
                }
                if (customItem) {
                  if (customItem.muted) {
                    if (prev[item._id].gainNodeL.gain.value !== 0) {
                      prev[item._id].gainNodeL.gain.setValueAtTime(0, audioContext.currentTime);
                      prev[item._id].gainNodeR.gain.setValueAtTime(0, audioContext.currentTime);
                    }
                  } else if (prev[item._id].gainNodeL.gain.value !== customItem.volume) {
                    prev[item._id].gainNodeL.gain.setValueAtTime(
                      customItem.volume,
                      audioContext.currentTime
                    );
                    prev[item._id].gainNodeR.gain.setValueAtTime(
                      customItem.volume,
                      audioContext.currentTime
                    );
                  }
                } else {
                  if (item.muted) {
                    if (prev[item._id].gainNodeL.gain.value !== 0) {
                      prev[item._id].gainNodeL.gain.setValueAtTime(0, audioContext.currentTime);
                      prev[item._id].gainNodeR.gain.setValueAtTime(0, audioContext.currentTime);
                    }
                  } else if (prev[item._id].gainNodeL.gain.value !== item.volume) {
                    prev[item._id].gainNodeL.gain.setValueAtTime(
                      item.volume,
                      audioContext.currentTime
                    );
                    prev[item._id].gainNodeR.gain.setValueAtTime(
                      item.volume,
                      audioContext.currentTime
                    );
                  }
                }
                return {
                  ...items,
                  [item._id]: prev[item._id],
                };
              }
              return items;
            }, {});
          });
        } catch (error) {
          handleError(error);
        }
      } else {
        setStageMemberNodes((prev) => {
          Object.keys(prev).forEach((id) => {
            prev[id].gainNodeL.disconnect();
            prev[id].gainNodeR.disconnect();
            prev[id].analyserNodeL.disconnect();
            prev[id].analyserNodeR.disconnect();
          });
          return {};
        });
      }
    }
  }, [audioContext, stageId, groupNodes, stageMembers, customStageMembers, handleError]);

  useEffect(() => {
    if (audioContext) {
      if (stageId && audioProducers.byStage[stageId] && handleError) {
        try {
          // Create for each group node an audio player
          setAudioProducerNodes((prev) => {
            // Clean up old nodes
            Object.keys(prev).forEach((id) => {
              if (!audioProducers.byId[id]) {
                if (prev[id].sourceNode) prev[id].sourceNode.disconnect();
                prev[id].gainNode.disconnect();
                prev[id].analyserNode.disconnect();
                prev[id].splitterNode.disconnect();
                prev[id].pannerNode.disconnect();
              }
            });
            return audioProducers.byStage[stageId].reduce((items, id) => {
              const item = audioProducers.byId[id];
              const customItem = customAudioProducers.byAudioProducer[item._id]
                ? customAudioProducers.byId[customAudioProducers.byAudioProducer[item._id]]
                : undefined;
              if (stageMemberNodes[item.stageMemberId]) {
                let gainNode;
                let analyserNode;
                let sourceNode;
                let pannerNode;
                let splitterNode;
                let element;
                if (!prev[item._id]) {
                  gainNode = audioContext.createGain();
                  gainNode.gain.value = 1;
                  // gainNode.gain.setValueAtTime(item.volume, audioContext.currentTime);
                  analyserNode = audioContext.createAnalyser();
                  gainNode.connect(analyserNode);
                  pannerNode = new TreeDimensionPannerNode(audioContext);
                  gainNode.connect(pannerNode.getNode());
                  splitterNode = audioContext.createChannelSplitter(2);
                  pannerNode.connect(splitterNode);
                  splitterNode.connect(stageMemberNodes[item.stageMemberId].gainNodeL, 0, 0);
                  splitterNode.connect(stageMemberNodes[item.stageMemberId].gainNodeR, 1, 0);
                } else {
                  gainNode = prev[item._id].gainNode;
                  analyserNode = prev[item._id].analyserNode;
                  pannerNode = prev[item._id].pannerNode;
                  splitterNode = prev[item._id].splitterNode;
                  if (customItem) {
                    if (customItem.muted) {
                      if (gainNode.gain.value !== 0) {
                        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                      }
                    } else if (gainNode.gain.value !== customItem.volume) {
                      gainNode.gain.setValueAtTime(customItem.volume, audioContext.currentTime);
                    }
                    // Calculate whole x, y, z using group, stage member and track information
                    const stageMember = stageMembers.byId[item.stageMemberId];
                    const customStageMember = customStageMembers.byStageMember[stageMember._id]
                      ? customStageMembers.byId[customStageMembers.byStageMember[stageMember._id]]
                      : undefined;
                    const group = groups.byId[stageMember.groupId];
                    const customGroup = customGroups.byGroup[stageMember.groupId]
                      ? customGroups.byId[customGroups.byGroup[stageMember.groupId]]
                      : undefined;
                    const params = calculate3DAudioParameters(
                      group,
                      customGroup,
                      stageMember,
                      customStageMember,
                      customItem
                    );
                    pannerNode.setPosition(params.x, params.y, params.z);
                    pannerNode.setOrientation(params.rX, params.rY, params.rZ);
                  } else {
                    if (item.muted) {
                      if (gainNode.gain.value !== 0) {
                        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                      }
                    } else if (gainNode.gain.value !== item.volume) {
                      gainNode.gain.setValueAtTime(item.volume, audioContext.currentTime);
                    }
                    // Calculate whole x, y, z using group, stage member and track information
                    const stageMember = stageMembers.byId[item.stageMemberId];
                    const customStageMember = customStageMembers.byStageMember[stageMember._id]
                      ? customStageMembers.byId[customStageMembers.byStageMember[stageMember._id]]
                      : undefined;
                    const group = groups.byId[stageMember.groupId];
                    const customGroup = customGroups.byGroup[stageMember.groupId]
                      ? customGroups.byId[customGroups.byGroup[stageMember.groupId]]
                      : undefined;
                    const params = calculate3DAudioParameters(
                      group,
                      customGroup,
                      stageMember,
                      customStageMember,
                      item
                    );
                    pannerNode.setPosition(params.x, params.y, params.z);
                    pannerNode.setOrientation(params.rX, params.rY, params.rZ);
                  }
                }
                if (
                  (!prev[item._id] || !prev[item._id].sourceNode) &&
                  audioConsumers.byProducer[item._id]
                ) {
                  // See, if there is a consumer
                  const audioConsumer = audioConsumers.byId[audioConsumers.byProducer[item._id]];
                  const stream = new MediaStream([audioConsumer.consumer.track]);

                  element = new Audio();
                  element.srcObject = stream;
                  element.autoplay = true;
                  element.muted = true;
                  element.play();

                  // sourceNode = audioContext.createMediaElementSource(element);
                  // sourceNode.connect(gainNode);

                  sourceNode = audioContext.createMediaStreamSource(stream);
                  sourceNode.connect(gainNode);
                }
                return {
                  ...items,
                  [item._id]: {
                    gainNode,
                    analyserNode,
                    sourceNode,
                    pannerNode,
                    splitterNode,
                    element,
                  },
                };
              }
              return items;
            }, {});
          });
        } catch (error) {
          handleError(error);
        }
      } else {
        setAudioProducerNodes((prev) => {
          Object.keys(prev).forEach((id) => {
            if (prev[id].sourceNode) prev[id].sourceNode.disconnect();
            prev[id].gainNode.disconnect();
            prev[id].analyserNode.disconnect();
            prev[id].splitterNode.disconnect();
            prev[id].pannerNode.disconnect();
          });
          return {};
        });
      }
    }
  }, [
    audioContext,
    stageMemberNodes,
    audioProducers,
    audioConsumers.byProducer,
    customAudioProducers,
    handleError,
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

export { StageWebAudioProvider };

export default useStageWebAudio;
