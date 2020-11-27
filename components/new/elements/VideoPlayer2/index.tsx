/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box } from 'theme-ui';
import { LocalConsumer } from '../../../../lib/use-digital-stage/types';
import { useEffect, useRef, useState } from 'react';

interface AnimationFrame {
  id: string; // Id from videoTrack
  src: CanvasImageSource;
  x: number;
  y: number;
  width: number;
  height: number;
}

const VideoPlayer2 = (props: { consumers: LocalConsumer[] }): React.ReactNode => {
  const { consumers } = props;
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();
  const [animationFrames, setAnimationFrames] = useState<AnimationFrame[]>([]);

  const wrapperRef = useRef<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement>();
  const videoContainerRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const videoTracks = consumers.map((localConsumer) => localConsumer.consumer.track);

    setAnimationFrames((prev) =>
      prev.filter((animationFrame) => {
        // Cleanup obsolete video elements
        return videoTracks.find((videoTrack) => videoTrack.id === animationFrame.id);
      })
    );

    videoTracks.forEach((videoTrack, index) => {
      if (animationFrames.find((animationFrame) => animationFrame.id !== videoTrack.id)) {
        const numRows = Math.ceil(Math.sqrt(videoTracks.length));

        const numColsMax = Math.ceil(videoTracks.length / numRows);

        const elementWidth = Math.round(width / numColsMax);
        const elementHeight = Math.round(height / numRows);

        const row = Math.ceil((index + 1) / numColsMax) - 1;
        const col = index % numColsMax;

        const x = col * elementWidth;
        const y = row * elementHeight;

        const videoElement = document.createElement('video');
        videoElement.id = `video-${videoTrack.id}`;
        videoElement.style.display = 'none';
        videoElement.width = elementWidth;
        videoElement.height = elementHeight;
        //videoElement.setAttribute("preload", 'none');
        videoElement.setAttribute('muted', 'true');
        videoElement.setAttribute('playsinline', 'true');
        videoElement.setAttribute('autoplay', 'true');
        videoElement.srcObject = new MediaStream([videoTrack]);

        setAnimationFrames((prev) => [
          ...prev,
          {
            id: videoTrack.id,
            src: videoElement,
            x,
            y,
            width: elementWidth,
            height: elementHeight,
          },
        ]);
      }
    });
  }, [consumers]);

  useEffect(() => {
    if (canvasRef.current) {
      const cancelAnimationFrame = window.requestAnimationFrame(() => {
        const context = canvasRef.current.getContext('2d');
        context.fillStyle = 'black';
        context.fillRect(0, 0, width, height);
        animationFrames.forEach((animationFrame: AnimationFrame) => {
          const videoWidth: number = (animationFrame.src as HTMLVideoElement).videoWidth as number;
          const videoHeight: number = (animationFrame.src as HTMLVideoElement)
            .videoHeight as number;
          const scale = Math.min(
            animationFrame.width / videoWidth,
            animationFrame.height / videoHeight
          );
          const x = animationFrame.x + (animationFrame.width / 2 - (videoWidth / 2) * scale);
          const y = animationFrame.y + (animationFrame.height / 2 - (videoHeight / 2) * scale);
          context.drawImage(
            animationFrame.src,
            0,
            0,
            videoWidth,
            videoHeight,
            x,
            y,
            videoWidth * scale,
            videoHeight * scale
          );
        });
      });
      return () => {
        window.cancelAnimationFrame(cancelAnimationFrame);
      };
    }
  }, [canvasRef, width, height, animationFrames]);

  return (
    <div ref={wrapperRef}>
      <canvas
        sx={{ width: '100%', height: '100%', stroke: 'red' }}
        ref={canvasRef}
        width={width}
        height={height}
      />
      <Box sx={{ display: 'none' }} ref={videoContainerRef} />
    </div>
  );
};
export default VideoPlayer2;
