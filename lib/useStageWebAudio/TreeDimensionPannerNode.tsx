import {
  IAudioContext,
  IAudioNode,
  IPannerNode,
  IStereoPannerNode,
} from 'standardized-audio-context';
import debug from 'debug';

const d = debug('useStageWebAudio:immersive');

let iOSSafari = false;

if (process.browser) {
  // Client-side-only code
  const ua = window.navigator.userAgent;
  const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
  const webkit = !!ua.match(/WebKit/i);
  iOSSafari = iOS && webkit && !ua.match(/CriOS/i) && !ua.match(/OPiOS/i);
  if (iOSSafari) {
    d('iOS Safari does not support immersive audio, yet. Falling back to stereo panning.');
  } else {
    d('Using 3D Audio');
  }
}

function isPannerNode(
  node: IPannerNode<IAudioContext> | IStereoPannerNode<IAudioContext>
): node is IPannerNode<IAudioContext> {
  return (node as IPannerNode<IAudioContext>).coneInnerAngle !== undefined;
}

class TreeDimensionPannerNode {
  private readonly audioContext: IAudioContext;
  private readonly node: IPannerNode<IAudioContext> | IStereoPannerNode<IAudioContext>;

  constructor(audioContext: IAudioContext) {
    this.audioContext = audioContext;
    if (iOSSafari) {
      this.node = audioContext.createStereoPanner();
      this.node.pan.value = 0;
    } else {
      this.node = audioContext.createPanner();
      this.node.panningModel = 'HRTF';
      this.node.distanceModel = 'inverse';
    }
  }

  public setPosition = (x: number, y: number, z: number): void => {
    if (isPannerNode(this.node) && !isNaN(x) && !isNaN(y) && !isNaN(z)) {
      this.node.positionX.setValueAtTime(x, this.audioContext.currentTime);
      this.node.positionY.setValueAtTime(y, this.audioContext.currentTime);
      this.node.positionZ.setValueAtTime(z, this.audioContext.currentTime);
    }
  };

  public setPositionX = (value: number): void => {
    if (isPannerNode(this.node) && !isNaN(value)) {
      this.node.positionX.setValueAtTime(value, this.audioContext.currentTime);
    }
  };
  public setPositionY = (value: number): void => {
    if (isPannerNode(this.node) && !isNaN(value)) {
      this.node.positionY.setValueAtTime(value, this.audioContext.currentTime);
    }
  };
  public setPositionZ = (value: number): void => {
    if (isPannerNode(this.node) && !isNaN(value)) {
      this.node.positionZ.setValueAtTime(value, this.audioContext.currentTime);
    }
  };

  public setOrientation = (x: number, y: number, z: number): void => {
    if (isPannerNode(this.node) && !isNaN(x) && !isNaN(y) && !isNaN(z)) {
      this.node.orientationX.setValueAtTime(x, this.audioContext.currentTime);
      this.node.orientationY.setValueAtTime(y, this.audioContext.currentTime);
      this.node.orientationZ.setValueAtTime(z, this.audioContext.currentTime);
    }
  };

  public setOrientationX = (value: number): void => {
    if (isPannerNode(this.node) && !isNaN(value)) {
      this.node.orientationX.setValueAtTime(value, this.audioContext.currentTime);
    }
  };

  public setOrientationY = (value: number): void => {
    if (isPannerNode(this.node) && !isNaN(value)) {
      this.node.orientationY.setValueAtTime(value, this.audioContext.currentTime);
    }
  };
  public setOrientationZ = (value: number): void => {
    if (isPannerNode(this.node) && !isNaN(value)) {
      this.node.orientationZ.setValueAtTime(value, this.audioContext.currentTime);
    }
  };

  public connect = (
    destinationNode: IAudioNode<IAudioContext>,
    output?: number,
    input?: number
  ): IAudioNode<IAudioContext> => {
    return this.node.connect<IAudioContext, IAudioNode<IAudioContext>>(
      destinationNode,
      output,
      input
    );
  };

  public disconnect = (output?: number): void => {
    return this.node.disconnect(output);
  };

  public getNode = (): IAudioNode<IAudioContext> => {
    return this.node;
  };
}

export default TreeDimensionPannerNode;
