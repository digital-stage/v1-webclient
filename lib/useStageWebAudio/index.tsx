import React, { useEffect, useState } from 'react';
import { IAnalyserNode, IAudioContext, IGainNode } from 'standardized-audio-context';

import {
  useAudioConsumers,
  useAudioProducers,
  useCurrentStageId,
  useCustomAudioProducerPositions, useCustomAudioProducerVolumes,
  useCustomGroupPositions, useCustomGroupVolumes, useCustomStageMemberPositions,
  useCustomStageMemberVolumes,
  useGroups,
  useStage,
  useStageMembersRaw,
} from '../use-digital-stage';
import useAudioContext from './../useAudioContext';
import TreeDimensionPannerNode from './TreeDimensionPannerNode';
import { calculate3DAudioParameters } from './utils';
import debug from 'debug';
import customGroupPositions from "../use-digital-stage/redux/reducers/customGroupPositions";

const report = debug('useStageWebAudio');
const reportCleanup = report.extend('cleanup');

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
    element?: HTMLAudioElement;
    gainNode: IGainNode<IAudioContext>;
    analyserNode: IAnalyserNode<IAudioContext>;
    pannerNode: TreeDimensionPannerNode;
  };
}

export interface StageWebAudioProps {
  byGroup: GainAudioNode;
  byStageMember: GainAudioNode;
  byAudioProducer: TrackAudioNode;
}

const StageWebAudioContext = React.createContext<StageWebAudioProps>(undefined);

const useStageWebAudio = (): StageWebAudioProps =>
  React.useContext<StageWebAudioProps>(StageWebAudioContext);

const StageWebAudioProvider = (props: {
  children: React.ReactNode;
  handleError: (error: Error) => void;
}): JSX.Element => {
  const { children, handleError } = props;
  const { destination, started } = useAudioContext();
  const [destinationNodes, setDestinationNodes] = useState<{
    left: IGainNode<IAudioContext>;
    right: IGainNode<IAudioContext>;
  }>(undefined);
  const [groupNodes, setGroupNodes] = useState<GainAudioNode>(undefined);
  const [stageMemberNodes, setStageMemberNodes] = useState<GainAudioNode>(undefined);
  const [audioProducerNodes, setAudioProducerNodes] = useState<TrackAudioNode>(undefined);

  // Incoming states from stage
  const stageId = useCurrentStageId();
  const stage = useStage(stageId);
  const groups = useGroups();
  const customGroupVolumes = useCustomGroupVolumes();
  const customGroupPositions = useCustomGroupPositions();
  const stageMembers = useStageMembersRaw();
  const customStageMemberVolumes = useCustomStageMemberVolumes();
  const customStageMemberPositions = useCustomStageMemberPositions();
  const audioProducers = useAudioProducers();
  const customAudioProducerPositions = useCustomAudioProducerPositions();
  const customAudioProducerVolumes = useCustomAudioProducerVolumes();
  const audioConsumers = useAudioConsumers();

  /**
   * ROOT NODES
   */
  useEffect(() => {
    if (handleError && destination && started) {
      try {
        const audioContext = destination.context;
        report('Creating both root nodes');
        const createdRootNodeL = audioContext.createGain();
        createdRootNodeL.connect(destination);
        const createdRootNodeR = audioContext.createGain();
        createdRootNodeR.connect(destination);

        setDestinationNodes({
          left: createdRootNodeL,
          right: createdRootNodeR,
        });

        return () => {
          reportCleanup('Removing and disconnecting both root nodes');
          createdRootNodeL.disconnect();
          createdRootNodeR.disconnect();
          setDestinationNodes(undefined);
        };
      } catch (error) {
        handleError(error);
      }
    }
  }, [started, destination, handleError]);

  useEffect(() => {
    if (destinationNodes && handleError && stageId && groups.byStage[stageId]) {
      const audioContext = destinationNodes.left.context;
      try {
        setGroupNodes((previous) => {
          const prev: GainAudioNode = {};
          if (previous) {
            Object.keys(previous).forEach((id) => {
              if (!groups.byId[id]) {
                reportCleanup('Removing deprecated group node ' + id);
                previous[id].gainNodeL.disconnect();
                previous[id].gainNodeR.disconnect();
                previous[id].analyserNodeL.disconnect();
                previous[id].analyserNodeR.disconnect();
              } else {
                prev[id] = previous[id];
              }
            });
          }

          return groups.byStage[stageId].reduce((items, id) => {
            const item = groups.byId[id];
            const customItem = customGroupVolumes.byGroup[item._id]
              ? customGroupVolumes.byId[customGroupVolumes.byGroup[item._id]]
              : undefined;
            if (!prev[id]) {
              report('Creating group node ' + id);
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
              gainNodeL.connect(destinationNodes.left);
              gainNodeR.connect(destinationNodes.right);
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
              } else if (
                customItem.volume &&
                prev[item._id].gainNodeL.gain.value !== customItem.volume
              ) {
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
              } else if (item.volume && prev[item._id].gainNodeL.gain.value !== item.volume) {
                prev[item._id].gainNodeL.gain.setValueAtTime(item.volume, audioContext.currentTime);
                prev[item._id].gainNodeR.gain.setValueAtTime(item.volume, audioContext.currentTime);
              }
            }

            return {
              ...items,
              [item._id]: prev[item._id],
            };
          }, prev);
        });
      } catch (error) {
        handleError(error);
      }
    } else {
      reportCleanup('Removing all group nodes');
      setGroupNodes((prev) => {
        if (prev) {
          Object.keys(prev).forEach((id) => {
            prev[id].gainNodeL.disconnect();
            prev[id].gainNodeR.disconnect();
            prev[id].analyserNodeL.disconnect();
            prev[id].analyserNodeR.disconnect();
          });
        }
        return undefined;
      });
    }
  }, [destinationNodes, stageId, groups, customGroupVolumes, handleError]);

  useEffect(() => {
    if (groupNodes && stageId && stageMembers.byStage[stageId] && handleError) {
      try {
        // Create for each group node an audio player
        setStageMemberNodes((previous) => {
          const prev: GainAudioNode = {};
          // Clean up old nodes
          if (previous) {
            Object.keys(previous).forEach((id) => {
              if (!stageMembers.byId[id]) {
                report('Removing deprecated stage member node ' + id);
                previous[id].gainNodeL.disconnect();
                previous[id].gainNodeR.disconnect();
                previous[id].analyserNodeL.disconnect();
                previous[id].analyserNodeR.disconnect();
              } else {
                prev[id] = previous[id];
              }
            });
          }

          return stageMembers.byStage[stageId].reduce((items, id) => {
            const item = stageMembers.byId[id];
            const customItem = customStageMemberVolumes.byStageMember[item._id]
              ? customStageMemberVolumes.byId[customStageMemberVolumes.byStageMember[item._id]]
              : undefined;
            if (groupNodes[item.groupId]) {
              const audioContext = groupNodes[item.groupId].gainNodeL.context;
              if (!prev[item._id]) {
                report('Creating stage member node ' + id);
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
                } else if (
                  customItem.volume &&
                  prev[item._id].gainNodeL.gain.value !== customItem.volume
                ) {
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
                } else if (item.volume && prev[item._id].gainNodeL.gain.value !== item.volume) {
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
          }, prev);
        });
      } catch (error) {
        handleError(error);
      }
    } else {
      setStageMemberNodes((prev) => {
        reportCleanup('Removing all stage member nodes ');
        if (prev) {
          Object.keys(prev).forEach((id) => {
            prev[id].gainNodeL.disconnect();
            prev[id].gainNodeR.disconnect();
            prev[id].analyserNodeL.disconnect();
            prev[id].analyserNodeR.disconnect();
          });
        }
        return undefined;
      });
    }
  }, [groupNodes, stageId, groupNodes, stageMembers, customStageMemberVolumes, handleError]);

  useEffect(() => {
    if (stageMemberNodes && stageId && audioProducers.byStage[stageId] && handleError) {
      try {
        // Create for each group node an audio player
        setAudioProducerNodes((previous) => {
          const prev: TrackAudioNode = {};
          // Clean up old nodes
          if (previous) {
            Object.keys(previous).forEach((id) => {
              if (!audioProducers.byId[id]) {
                reportCleanup('Removing deprecated producer node ' + id);
                previous[id].gainNode.disconnect();
                previous[id].analyserNode.disconnect();
                previous[id].pannerNode.disconnect();
              } else {
                prev[id] = previous[id];
              }
            });
          }
          return audioProducers.byStage[stageId].reduce((items, id) => {
            const item = audioProducers.byId[id];
            const customItemVolume = customAudioProducerVolumes.byAudioProducer[item._id]
              ? customAudioProducerVolumes.byId[customAudioProducerVolumes.byAudioProducer[item._id]]
              : undefined;
            const customItemPosition = customAudioProducerPositions.byAudioProducer[item._id]
                ? customAudioProducerPositions.byId[customAudioProducerPositions.byAudioProducer[item._id]]
                : undefined;
            if (stageMemberNodes[item.stageMemberId]) {
              const audioContext = stageMemberNodes[item.stageMemberId].gainNodeL.context;
              let gainNode;
              let analyserNode;
              let sourceNode;
              let pannerNode;
              let element;
              if (!prev[item._id]) {
                report('Creating producer node ' + id);
                gainNode = audioContext.createGain();
                gainNode.gain.value = 1;
                analyserNode = audioContext.createAnalyser();
                gainNode.connect(analyserNode);
                pannerNode = new TreeDimensionPannerNode(audioContext);
                gainNode.connect(pannerNode.getNode());
                pannerNode.connect(stageMemberNodes[item.stageMemberId].gainNodeL, 0, 0);
                pannerNode.connect(stageMemberNodes[item.stageMemberId].gainNodeR, 0, 0);
              } else {
                element = prev[item._id].element;
                gainNode = prev[item._id].gainNode;
                analyserNode = prev[item._id].analyserNode;
                pannerNode = prev[item._id].pannerNode;
                if (customItemVolume) {
                  if (customItemVolume.muted) {
                    if (gainNode.gain.value !== 0) {
                      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                    }
                  } else if (customItemVolume.volume && gainNode.gain.value !== customItemVolume.volume) {
                    gainNode.gain.setValueAtTime(customItemVolume.volume, audioContext.currentTime);
                  }
                  // Calculate whole x, y, z using group, stage member and track information
                  const stageMember = stageMembers.byId[item.stageMemberId];
                  const customStageMember = customStageMemberPositions.byStageMember[stageMember._id]
                    ? customStageMemberPositions.byId[customStageMemberPositions.byStageMember[stageMember._id]]
                    : undefined;
                  const group = groups.byId[stageMember.groupId];
                  const customGroup = customGroupPositions.byGroup[stageMember.groupId]
                    ? customGroupPositions.byId[customGroupPositions.byGroup[stageMember.groupId]]
                    : undefined;
                  const params = calculate3DAudioParameters(
                    group,
                    customGroup,
                    stageMember,
                    customStageMember,
                    customItemPosition
                  );
                  pannerNode.setPosition(params.x, params.y, params.z);
                  pannerNode.setOrientation(params.rX, params.rY, params.rZ);
                } else {
                  if (item.muted) {
                    if (gainNode.gain.value !== 0) {
                      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                    }
                  } else if (item.volume && gainNode.gain.value !== item.volume) {
                    gainNode.gain.setValueAtTime(item.volume, audioContext.currentTime);
                  }
                }

                // Calculate whole x, y, z using group, stage member and track information
                const stageMember = stageMembers.byId[item.stageMemberId];
                const customStageMember = customStageMemberPositions.byStageMember[stageMember._id]
                  ? customStageMemberPositions.byId[customStageMemberPositions.byStageMember[stageMember._id]]
                  : undefined;
                const group = groups.byId[stageMember.groupId];
                const customGroup = customGroupPositions.byGroup[stageMember.groupId]
                  ? customGroupPositions.byId[customGroupPositions.byGroup[stageMember.groupId]]
                  : undefined;
                const params = calculate3DAudioParameters(
                  group,
                  customGroup,
                  stageMember,
                  customStageMember,
                  item
                );
                pannerNode.setMaxDistance(Math.max(stage.width, stage.height));
                pannerNode.setPosition(params.x, params.y, params.z);
                pannerNode.setOrientation(params.rX, params.rY, params.rZ);
              }
              if (audioConsumers.byProducer[item._id]) {
                if (!element || element.id !== audioConsumers.byProducer[item._id]) {
                  report('Attaching consumer to producer node ' + id);
                  // See, if there is a consumer
                  const audioConsumer = audioConsumers.byId[audioConsumers.byProducer[item._id]];
                  const stream = new MediaStream([audioConsumer.consumer.track]);

                  element = new Audio();
                  element.id = audioConsumer._id;
                  element.srcObject = stream;
                  element.autoplay = true;
                  element.muted = true;
                  element.play();

                  // sourceNode = audioContext.createMediaElementSource(element);
                  // sourceNode.connect(gainNode);

                  sourceNode = audioContext.createMediaStreamSource(stream);
                  sourceNode.connect(gainNode);
                }
              }
              return {
                ...items,
                [item._id]: {
                  gainNode,
                  analyserNode,
                  sourceNode,
                  pannerNode,
                  element,
                },
              };
            }
            return items;
          }, prev);
        });
      } catch (error) {
        handleError(error);
      }
    } else {
      reportCleanup('Removing all audio producers');
      setAudioProducerNodes((prev) => {
        if (prev) {
          Object.keys(prev).forEach((id) => {
            prev[id].gainNode.disconnect();
            prev[id].analyserNode.disconnect();
            prev[id].pannerNode.disconnect();
          });
        }
        return undefined;
      });
    }
  }, [
    stage,
    stageMemberNodes,
    audioProducers,
    audioConsumers.byProducer,
    customAudioProducerPositions,
    customAudioProducerVolumes,
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
