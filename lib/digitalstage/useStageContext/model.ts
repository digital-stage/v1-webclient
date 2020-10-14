import * as Server from "../common/model.server";
import mediasoupClient from "mediasoup-client";


export type LocalUser = Server.User;
export type User = Server.User;
export type Device = Server.Device;

//TODO: isadmin
export type Stage = Server.Stage & { isAdmin: false };
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
    audioProducer: string
    msConsumer: mediasoupClient.types.Consumer
};
export type VideoConsumer = {
    _id: string;
    stage: string;
    stageMember: string;
    videoProducer: string;
    msConsumer: mediasoupClient.types.Consumer
};