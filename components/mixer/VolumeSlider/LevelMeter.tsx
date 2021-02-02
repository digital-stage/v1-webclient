/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui';
import React, { CanvasHTMLAttributes, useRef } from 'react';
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

const LevelMeter = (
  props: CanvasHTMLAttributes<HTMLCanvasElement> & {
    analyser: IAnalyserNode<IAudioContext>;
  }
): JSX.Element => {
  const { analyser, ...rest } = props;
  const canvasRef = useRef<HTMLCanvasElement>();

  useAnimationFrame(() => {
    if (analyser && canvasRef.current) {
      const array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      const average = getAverageVolume(array);
      const { width } = canvasRef.current;
      const { height } = canvasRef.current;

      const context: CanvasRenderingContext2D = canvasRef.current.getContext('2d');

      context.clearRect(0, 0, width, height);

      const gradient = context.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#012340');
      gradient.addColorStop(1, '#F20544');
      context.fillStyle = gradient;
      context.fillRect(0, 0, average, height);
    }
  });

  return (
    <canvas
      {...rest}
      sx={{
        width: '100%',
        height: '100%',
      }}
      ref={canvasRef}
    />
  );
};
export default LevelMeter;
