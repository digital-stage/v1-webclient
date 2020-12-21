/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useRef } from 'react';
import { jsx } from 'theme-ui';
import { IAnalyserNode, IAudioContext } from 'standardized-audio-context';
import useAnimationFrame from '../../../lib/useAnimationFrame';

function getAverageVolume(array: Uint8Array): number {
  let values = 0;

  const { length } = array;

  // get all the frequency amplitudes
  for (let i = 0; i < length; i += 1) {
    values += array[i];
  }

  return values / length;
}

const LevelMeter = (props: {
  analyser: IAnalyserNode<IAudioContext>;
  vertical?: boolean;
  className?: string;
}): JSX.Element => {
  const { className } = props;
  const canvasRef = useRef<HTMLCanvasElement>();

  useAnimationFrame(() => {
    if (props.analyser && canvasRef.current) {
      const array = new Uint8Array(props.analyser.frequencyBinCount);
      props.analyser.getByteFrequencyData(array);
      const average = getAverageVolume(array);
      const { width } = canvasRef.current;
      const { height } = canvasRef.current;

      const context: CanvasRenderingContext2D = canvasRef.current.getContext('2d');

      context.clearRect(0, 0, width, height);

      if (props.vertical) {
        const gradient = context.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#012340');
        gradient.addColorStop(0.75, '#F20544');
        gradient.addColorStop(1, '#F20544');
        context.fillStyle = gradient;
        context.fillRect(0, 0, average, height);
      } else {
        const gradient = context.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(1, '#012340');
        gradient.addColorStop(0.75, '#F20544');
        gradient.addColorStop(0, '#F20544');
        context.fillStyle = gradient;
        context.fillRect(0, height - average, width, height);
      }
    }
  });

  return (
    <canvas
      className={className}
      ref={canvasRef}
      sx={{
        width: '100%',
        height: '240px',
      }}
    />
  );
};
export default LevelMeter;
