/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Text, Flex } from 'theme-ui';
import { ThreeDimensionAudioProperties } from '../../../lib/use-digital-stage/types';
import { IAnalyserNode, IAudioContext } from 'standardized-audio-context';
import HSLColor from '../../../lib/useColors/HSLColor';

const ChannelRow = (props: {
  name: string;
  values: ThreeDimensionAudioProperties;
  analyserL?: IAnalyserNode<IAudioContext>;
  analyserR?: IAnalyserNode<IAudioContext>;

  color?: HSLColor;
  isLastChild?: boolean;

  numChildLayers?: number;

  onChange: (volume: number, muted: boolean) => void;

  reset?: boolean;
  onReset?: () => void;

  children?: React.ReactNode;

  className?: string;

  inactive?: boolean;
}): JSX.Element => {
  return <Flex></Flex>;
};
export default ChannelRow;
