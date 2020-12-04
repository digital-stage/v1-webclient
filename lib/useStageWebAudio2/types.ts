import { IAnalyserNode, IAudioContext, IAudioNode, IGainNode } from 'standardized-audio-context';
import { IMediaStreamAudioSourceNode } from 'standardized-audio-context/src/interfaces/media-stream-audio-source-node';
import TreeDimensionPannerNode from './TreeDimensionPannerNode';
import { ThreeDimensionAudioProperties } from '../use-digital-stage/types';

export type Item = ThreeDimensionAudioProperties & { _id: string };

export interface CustomItems {
  byItem: {
    [itemId: string]: string;
  };
  byId: {
    [id: string]: ThreeDimensionAudioProperties;
  };
}

export interface SingleRootNodes {
  rootNodes: {
    left: IGainNode<IAudioContext>;
    right: IGainNode<IAudioContext>;
  };
}

export interface MultipleRootNodes {
  byId: {
    [id: string]: SingleRootNodes;
  };
}
export type TargetNodes = SingleRootNodes | MultipleRootNodes;

export function isMultipleRootNodes(targetNodes: TargetNodes): targetNodes is MultipleRootNodes {
  return (targetNodes as MultipleRootNodes).byId !== undefined;
}

export interface GainAudioNode extends SingleRootNodes {
  analyserNodes: {
    left: IAnalyserNode<IAudioContext>;
    right: IAnalyserNode<IAudioContext>;
  };
}

export interface GainAudioNodeCollection {
  byId: {
    [id: string]: GainAudioNode;
  };
}

export interface AudioProducerNode {
  element?: HTMLAudioElement;
  gainNode: IGainNode<IAudioContext>;
  analyserNode: IAnalyserNode<IAudioContext>;
  splitterNode: IAudioNode<IAudioContext>;
  pannerNode: TreeDimensionPannerNode;
}

export interface AudioProducerNodesCollection {
  byId: {
    [id: string]: AudioProducerNode;
  };
}

export const getTargetNodes = (targetNodes: TargetNodes, id: string): SingleRootNodes => {
  if (isMultipleRootNodes(targetNodes)) {
    console.debug('useStageWebAudio isMultipleRootNodes ');
    console.debug('useStageWebAudio', targetNodes);
    return targetNodes.byId[id];
  }
  console.debug('useStageWebAudio isSingle ');
  return targetNodes;
};
