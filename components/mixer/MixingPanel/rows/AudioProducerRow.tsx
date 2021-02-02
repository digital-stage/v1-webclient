/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from 'theme-ui';
import {
  CustomRemoteAudioProducer,
  RemoteAudioProducer,
} from '../../../../lib/use-digital-stage/types';

const AudioProducerRow = (props: {
  audioProducer: RemoteAudioProducer;
  customAudioProducer?: CustomRemoteAudioProducer;
  onChange: (volume: number, muted: boolean) => void;
  children?: React.ReactNode;
  reset?: boolean;
  onReset?: () => void;
  padding?: number;
  isLastChild?: boolean;
  inactive?: boolean;
}) => {
  return <div></div>;
};
export default AudioProducerRow;
