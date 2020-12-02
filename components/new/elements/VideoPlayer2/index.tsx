/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box } from 'theme-ui';
import { LocalConsumer } from '../../../../lib/use-digital-stage/types';
import { useCallback, useEffect, useRef, useState } from 'react';

const VideoPlayer = (props: { consumers: LocalConsumer[] }): JSX.Element => {
  const { consumers } = props;
  const wrapperRef = useRef<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement>();
  const videoContainerRef = useRef<HTMLDivElement>();
  const [size, setSize] = useState<DOMRect>();
  const [videoElements, setVideoElements] = useState<HTMLVideoElement[]>([]);

  useEffect(() => {
    if (wrapperRef.current) {
      const handleResize = () => {
        const size: DOMRect = wrapperRef.current.getBoundingClientRect();
        setSize(size);
      };
      wrapperRef.current.addEventListener('resize', handleResize);
      handleResize();
      return () => {
        if (wrapperRef.current) wrapperRef.current.removeEventListener('resize', handleResize);
      };
    }
  }, [wrapperRef]);

  useEffect(() => {
    if (size && consumers.length > 0) {
      const numRows = Math.ceil(Math.sqrt(consumers.length));
      const numColsMax = Math.ceil(consumers.length / numRows);
      const elementWidth = Math.round(size.width / numColsMax);
      const elementHeight = Math.round(size.height / numRows);
      setVideoElements(
        consumers
          .map((consumer) => consumer.consumer.track)
          .map((track) => {
            const videoElement = document.createElement<'video'>('video');
            videoElement.style.display = 'none';
            videoElement.width = elementWidth;
            videoElement.height = elementHeight;
            videoElement.setAttribute('muted', 'true');
            videoElement.setAttribute('playsinline', 'true');
            videoElement.setAttribute('autoplay', 'true');
            videoElement.srcObject = new MediaStream([track]);
            //TODO: Make method async and/or handle then
            videoElement
              .play()
              .then(() => {
                console.debug('PLAYING VIDEO');
              })
              .catch((err) => console.error(err));
            return videoElement;
          })
      );
    }
    return () => setVideoElements([]);
  }, [consumers, size]);

  useEffect(() => {
    if (videoContainerRef.current) {
      videoElements.forEach((videoElement) => videoContainerRef.current.append(videoElement));
      return () => {
        if (videoContainerRef.current)
          videoContainerRef.current.childNodes.forEach((c) =>
            videoContainerRef.current.removeChild(c)
          );
      };
    }
  }, [videoElements, videoContainerRef]);

  const requestRef = React.useRef<number>();

  const drawAnimationFrames = useCallback(() => {
    if (canvasRef.current && size) {
      canvasRef.current.width = canvasRef.current.width + 0;
      const context = canvasRef.current.getContext('2d');
      context.fillStyle = 'black';
      context.fillRect(0, 0, size.width, size.height);
      const numRows = Math.ceil(Math.sqrt(videoElements.length));

      if (numRows > 0) {
        const numColsMax = Math.ceil(videoElements.length / numRows);

        const elementWidth = Math.round(size.width / numColsMax);
        const elementHeight = Math.round(size.height / numRows);

        videoElements.forEach((videoElement) => {
          const scale = Math.min(
            elementWidth / videoElement.videoWidth,
            elementHeight / videoElement.videoHeight
          );

          const x = 0;
          const y = 0;

          context.drawImage(
            videoElement,
            0,
            0,
            videoElement.videoWidth,
            videoElement.videoHeight,
            x,
            y,
            videoElement.videoWidth * scale,
            videoElement.videoHeight * scale
          );
        });
      }
    }
    requestRef.current = window.requestAnimationFrame(drawAnimationFrames);
  }, [canvasRef, videoElements, size]);

  useEffect(() => {
    requestRef.current = window.requestAnimationFrame(drawAnimationFrames);
    return () => {
      window.cancelAnimationFrame(requestRef.current);
    };
  }, [drawAnimationFrames]);

  return (
    <Box sx={{ width: '100%', height: '100%' }} ref={wrapperRef}>
      <canvas
        sx={{ width: '100%', height: '100%', stroke: 'red', transform: 'scale(-1, 1)' }}
        ref={canvasRef}
        width={size && size.width}
        height={size && size.height}
      />
      <Box sx={{ display: 'none' }} ref={videoContainerRef} />
    </Box>
  );
};
export default VideoPlayer;
