import mediasoupClient from 'mediasoup-client';

/**
 * Local consumer, stored inside Redux to use it in video or audio components
 */
export interface LocalConsumer {
  _id: string;
  stageId: string;
  stageMemberId: string;
  producerId: string;
  consumer: mediasoupClient.types.Consumer;
}
