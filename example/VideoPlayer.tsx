/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, SxStyleProp } from 'theme-ui';
import React, { useEffect, useRef } from 'react';

const VideoPlayer = (props: {
  sx?: SxStyleProp;
  className?: string;
  video: MediaStream;
}): JSX.Element => {
  const { sx, className, video } = props;
  const videoRef = useRef<HTMLVideoElement>();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = video;
    }
  }, [video, videoRef]);

  return (
    <video
      sx={{
        ...sx,
        objectFit: 'cover',
        transform: 'scale(-1, 1)',
      }}
      className={className}
      ref={videoRef}
      autoPlay={true}
      muted={true}
    />
  );
};
export default VideoPlayer;
