import mediasoupClient from 'mediasoup-client';
import * as Server from './model.server';

export namespace Client {
  /**
   * Create different components:
   *
   * - StageView (only consuming stage, but have group component)
   * - GroupsListView (only consuming groups)
   * - GroupView (only consuming stage members)
   * - StageMemberView (only consuming stage member, custom stage member and further)
   */
  export interface Stage extends Server.Stage {
    isAdmin: boolean;
  }

  export interface Group extends Server.Group {
    customVolume?: number;
  }

  export interface StageMemberAudio extends Server.StageMemberAudioProducer {
    msConsumer?: mediasoupClient.types.Consumer;
  }

  export interface StageMemberVideo extends Server.StageMemberVideoProducer {
    msConsumer?: mediasoupClient.types.Consumer;
  }

  export type StageMemberOvTrack = Server.StageMemberOvTrack;

  export interface StageMember extends Server.StageMember {
    customVolume?: number;
    videoConsumers: StageMemberVideo[];
    audioConsumers: StageMemberAudio[];
    ovTracks: StageMemberOvTrack[];
  }

  export interface LocalAudioProducer extends Server.GlobalAudioProducer {
    msProducer: mediasoupClient.types.Producer;
  }

  export interface LocalVideoProducer extends Server.GlobalAudioProducer {
    msProducer: mediasoupClient.types.Producer;
  }
}

namespace ClientModel {
  export interface Stage extends Client.Stage {
    groups: Group[];
  }

  export interface Group extends Client.Group {
    stageMembers: StageMember[];
  }

  export interface StageMember extends Client.StageMember {
    name: string;
    avatarUrl?: string;
    customVolume?: number;
  }

  export interface StageMemberAudio extends Client.StageMemberAudio {
    customVolume?: number;
    actualVolume: number;
  }

  export interface StageMemberOvTrack extends Client.StageMemberOvTrack {
    customVolume?: number;
    actualVolume: number;
  }
}

export default ClientModel;
