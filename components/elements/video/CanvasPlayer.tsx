import React from 'react';
import { styled } from 'baseui';
import { VideoConsumer } from '../../../lib/digitalstage/useStageContext/model';

interface CanvasElement extends HTMLCanvasElement {
  captureStream(): MediaStream;
}

const Canvas = styled('canvas', {
  width: '100%',
  height: '100%',
  stroke: 'red',
});
const HiddenContainer = styled('div', {
  display: 'none',
});

interface AnimationFrame {
  id: string, // Id from videoTrack
  src: CanvasImageSource,
  x: number,
  y: number,
  width: number,
  height: number
}

interface Props {
  consumers: VideoConsumer[];
  className?: string;
}

interface States {
  animationFrames: AnimationFrame[];
  drawing: boolean;
  size?: DOMRect;
}

export default class CanvasPlayer extends React.Component<Props, States> {
  wrapperRef: React.RefObject<HTMLDivElement>;

  canvasRef: React.RefObject<CanvasElement>;

  videoContainerRef: React.RefObject<HTMLDivElement>;

  animationFrameId: any;

  constructor(props) {
    super(props);
    this.state = {
      drawing: false,
      animationFrames: [],
    };
    this.wrapperRef = React.createRef<HTMLDivElement>();
    this.canvasRef = React.createRef<CanvasElement>();
    this.videoContainerRef = React.createRef<HTMLDivElement>();
  }

  private handleResize = () => {
    const size: DOMRect = this.wrapperRef.current.getBoundingClientRect();
    this.setState({
      size,
    });
  };

  componentDidMount(): void {
    this.wrapperRef.current.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.animationFrameId);
    this.wrapperRef.current.removeEventListener('resize', this.handleResize);
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<States>): void {
    const { consumers } = this.props;
    const { size, animationFrames } = this.state;
    if (prevProps.consumers !== consumers
            || prevState.size !== size) {
      // Video producers or size of wrapper has changed
      if (size) {
        const videoTracks: MediaStreamTrack[] = consumers
          .filter((vp) => vp.msConsumer && vp.msConsumer.track)
          .map((vp) => vp.msConsumer.track);

        const numRows = Math.ceil(Math.sqrt(videoTracks.length));

        // Get and directly clean up
        const currentAnimationFrames: AnimationFrame[] = animationFrames
          .filter(
            (animationFrame: AnimationFrame) => videoTracks
              .find(
                (track) => track.id === animationFrame.id,
              ),
          );

        if (numRows > 0) {
          const numColsMax = Math.ceil(videoTracks.length / numRows);

          const elementWidth = Math.round(size.width / numColsMax);
          const elementHeight = Math.round(size.height / numRows);

          for (let i = 0; i < videoTracks.length; i += 1) {
            const track: MediaStreamTrack = videoTracks[i];

            // Current row:
            const row = Math.ceil((i + 1) / numColsMax) - 1;
            const col = i % (numColsMax);

            const x = col * elementWidth;
            const y = row * elementHeight;

            let videoElement: HTMLVideoElement | null = document.getElementById(`video-${track.id}`) as HTMLVideoElement | null;
            if (!videoElement) {
              videoElement = document.createElement('video');
              videoElement.id = `video-${track.id}`;
              videoElement.style.display = 'none';
              videoElement.width = elementWidth;
              videoElement.height = elementHeight;
              videoElement.setAttribute('muted', 'true');
              videoElement.setAttribute('playsinline', 'true');
              videoElement.setAttribute('autoplay', 'true');
              videoElement.srcObject = new MediaStream([videoTracks[i]]);
              videoElement.play();
              this.videoContainerRef.current.append(videoElement);
            }

            const animationFrame = currentAnimationFrames
              .find((currAnimationFrame: AnimationFrame) => currAnimationFrame.id === track.id);
            if (!animationFrame) {
              currentAnimationFrames.push({
                id: track.id,
                src: videoElement,
                x,
                y,
                width: elementWidth,
                height: elementHeight,
              });
            } else {
              // Just change the meta data
              animationFrame.x = x;
              animationFrame.y = y;
              animationFrame.width = elementWidth;
              animationFrame.height = elementHeight;
            }
          }
        }

        this.setState({
          animationFrames: currentAnimationFrames,
          drawing: currentAnimationFrames.length > 0,
        });
      }
    }

    if (prevState.drawing !== this.state.drawing) {
      if (this.state.drawing) {
        this.animationFrameId = window.requestAnimationFrame(this.drawAnimationFrames);
      } else {
        window.cancelAnimationFrame(this.animationFrameId);
      }
    }
  }

  private drawAnimationFrames = () => {
    const { size } = this.state;
    if (this.state.size && this.canvasRef) {
      this.canvasRef.current.width = this.canvasRef.current.width + 0;
      const context = this.canvasRef.current.getContext('2d');
      context.fillStyle = 'black';
      // context.strokeStyle = 'red';
      context.fillRect(0, 0, this.state.size.width, this.state.size.height);
      this.state.animationFrames.forEach(
        (animationFrame: AnimationFrame) => {
          const videoWidth: number = (animationFrame.src as HTMLVideoElement).videoWidth as number;
          const videoHeight: number = (animationFrame.src as HTMLVideoElement).videoHeight as number;
          const scale = Math.min(animationFrame.width / videoWidth, animationFrame.height / videoHeight);
          const x = animationFrame.x + ((animationFrame.width / 2) - (videoWidth / 2) * scale);
          const y = animationFrame.y + ((animationFrame.height / 2) - (videoHeight / 2) * scale);

          // context.strokeRect(animationFrame.x, animationFrame.y, animationFrame.width, animationFrame.height);
          // context.fillRect(animationFrame.x, animationFrame.y, animationFrame.width, animationFrame.height);

          context.drawImage(animationFrame.src,
            0,
            0,
            videoWidth,
            videoHeight,
            x,
            y,
            videoWidth * scale,
            videoHeight * scale);
        },
      );
      this.animationFrameId = window.requestAnimationFrame(this.drawAnimationFrames);
    }
  };

  render() {
    return (
      <div className={this.props.className} ref={this.wrapperRef}>
        <Canvas
          ref={this.canvasRef}
          width={this.state.size && this.state.size.width}
          height={this.state.size && this.state.size.height}
        />
        <HiddenContainer ref={this.videoContainerRef} />
      </div>
    );
  }
}
