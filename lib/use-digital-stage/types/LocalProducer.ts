import mediasoupClient from 'mediasoup-client';
import { GlobalProducer } from './GlobalProducer';

export interface LocalProducer {
  global: GlobalProducer;
  local: mediasoupClient.types.Producer;
}
