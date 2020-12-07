import { GainAudioNode, SingleRootNodes } from '../types';
import { ThreeDimensionAudioProperties } from '../../use-digital-stage/types';

export const createGainAudioNode = (
  targetNodes: SingleRootNodes,
  item: ThreeDimensionAudioProperties,
  customItem?: ThreeDimensionAudioProperties
): GainAudioNode => {
  const audioContext = targetNodes.rootNodes.left.context;
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
  gainNodeL.connect(targetNodes.rootNodes.left);
  gainNodeR.connect(targetNodes.rootNodes.right);
  return {
    rootNodes: {
      left: gainNodeL,
      right: gainNodeR,
    },
    analyserNodes: {
      left: analyserNodeL,
      right: analyserNodeR,
    },
  } as GainAudioNode;
};

export const updateGainAudioNode = (
  targetNodes: SingleRootNodes,
  gainAudioNode: GainAudioNode,
  item: ThreeDimensionAudioProperties,
  customItem?: ThreeDimensionAudioProperties
): GainAudioNode => {
  const audioContext = targetNodes.rootNodes.left.context;
  if (customItem) {
    if (customItem.muted) {
      if (gainAudioNode.rootNodes.left.gain.value !== 0) {
        gainAudioNode.rootNodes.left.gain.setValueAtTime(0, audioContext.currentTime);
        gainAudioNode.rootNodes.right.gain.setValueAtTime(0, audioContext.currentTime);
      }
    } else if (gainAudioNode.rootNodes.left.gain.value !== customItem.volume) {
      gainAudioNode.rootNodes.left.gain.setValueAtTime(customItem.volume, audioContext.currentTime);
      gainAudioNode.rootNodes.right.gain.setValueAtTime(
        customItem.volume,
        audioContext.currentTime
      );
    }
  } else {
    if (item.muted) {
      if (gainAudioNode.rootNodes.left.gain.value !== 0) {
        gainAudioNode.rootNodes.left.gain.setValueAtTime(0, audioContext.currentTime);
        gainAudioNode.rootNodes.right.gain.setValueAtTime(0, audioContext.currentTime);
      }
    } else if (gainAudioNode.rootNodes.left.gain.value !== item.volume) {
      gainAudioNode.rootNodes.left.gain.setValueAtTime(item.volume, audioContext.currentTime);
      gainAudioNode.rootNodes.right.gain.setValueAtTime(item.volume, audioContext.currentTime);
    }
  }
  return gainAudioNode;
};
export const disconnectGainAudioNode = (gainAudioNode: GainAudioNode) => {
  gainAudioNode.rootNodes.left.disconnect();
  gainAudioNode.rootNodes.right.disconnect();
  gainAudioNode.analyserNodes.left.disconnect();
  gainAudioNode.analyserNodes.right.disconnect();
};
