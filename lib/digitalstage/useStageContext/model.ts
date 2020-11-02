import mediasoupClient from 'mediasoup-client';
import * as Server from '../common/model.server';

export type LocalUser = Server.User;
export type User = Server.User;
export type Device = Server.Device;

export type Stage = Server.Stage & { isAdmin: boolean };
export type Group = Server.Group;
export type CustomGroup = Server.CustomGroup;
export type StageMember = Server.StageMember;
export type CustomStageMember = Server.CustomStageMember;
export type VideoProducer = Server.StageMemberVideoProducer;
export type AudioProducer = Server.StageMemberAudioProducer;
export type CustomAudioProducer = Server.CustomStageMemberAudioProducer;
export type OvTrack = Server.StageMemberOvTrack;
export type CustomOvTrack = Server.CustomStageMemberOvTrack;
export type AudioConsumer = {
  _id: string;
  stage: string;
  stageMember: string;
  audioProducer: string;
  msConsumer: mediasoupClient.types.Consumer;
};
export type VideoConsumer = {
  _id: string;
  stage: string;
  stageMember: string;
  videoProducer: string;
  msConsumer: mediasoupClient.types.Consumer;
};

export interface Collection<T> {
  byId: {
    [id: string]: T;
  };
  allIds: string[];
}

export interface ExtendedCollection<T> extends Collection<T> {
  [keys: string]: any;
}
