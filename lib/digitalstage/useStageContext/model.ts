import * as Server from "../common/model.server";
import mediasoupClient from "mediasoup-client";


export type LocalUser = Server.User;
export type User = Server.User & { stageMembers: string[] };
export type Device = Server.Device;

export type Stage = Server.Stage & { isAdmin: boolean, groups: string[] };
export type Group = Server.Group & { customGroup?: string, stageMembers: string[] };
export type CustomGroup = Server.CustomGroup;
export type StageMember =
    Server.StageMember
    & { customStageMember?: string, audioProducers: string[], videoProducers: string[], ovTracks: string[] };
export type CustomStageMember = Server.CustomStageMember;
export type VideoProducer = Server.StageMemberVideoProducer & { consumer?: string };
export type AudioProducer = Server.StageMemberAudioProducer & { customAudioProducer?: string, consumer?: string };
export type CustomAudioProducer = Server.CustomStageMemberAudioProducer;
export type OvTrack = Server.StageMemberOvTrack & { customOvTrack?: string };
export type CustomOvTrack = Server.CustomStageMemberOvTrack;
export type AudioConsumer = {
    audioProducer: string
    msConsumer: mediasoupClient.types.Consumer
};
export type VideoConsumer = {
    videoProducer: string
    msConsumer: mediasoupClient.types.Consumer
};