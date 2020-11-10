import { shallowEqual } from 'react-redux';
import {
  AudioConsumers,
  Groups,
  NormalizedState,
  OvTracks,
  StageMembers,
  Stages,
  Users,
  VideoConsumers,
} from './useStageContext/schema';
import { useSelector } from './useStageContext/redux';
import {
  AudioConsumer,
  Group,
  OvTrack,
  Stage,
  StageMember,
  VideoConsumer,
} from './useStageContext/model';

export interface ExtendedStageMember extends StageMember {
  name: string;
  avatarUrl?: string;
  videoConsumers: VideoConsumer[];
  audioConsumers: AudioConsumer[];
  ovTracks: OvTrack[];
}

function useStageSelector<T>(callback: (state: NormalizedState) => T): T {
  return useSelector<NormalizedState, T>(callback, shallowEqual);
}

export function useStages(): Stage[] {
  const stages = useSelector<NormalizedState, Stages>((state) => state.stages, shallowEqual);
  return stages.allIds.map((id) => stages.byId[id]);
}

export function useCurrentStage(): Stage {
  const stageId = useSelector<NormalizedState, string>((state) => state.stageId, shallowEqual);
  const stage = useSelector<NormalizedState, Stage>(
    (state) => (stageId ? state.stages.byId[stageId] : undefined),
    shallowEqual
  );
  return stage;
}

export function useCurrentGroup(): Group {
  const groupId = useSelector<NormalizedState, string>((state) => state.groupId, shallowEqual);
  return useSelector<NormalizedState, Group>(
    (state) => (groupId ? state.groups.byId[groupId] : undefined),
    shallowEqual
  );
}

export function useGroups(): Group[] {
  const groups = useSelector<NormalizedState, Groups>((state) => state.groups, shallowEqual);
  return groups.allIds.map((id) => groups.byId[id]);
}

export function useGroupsByStage(stageId: string): Group[] {
  return useSelector<NormalizedState, Group[]>(
    (state) =>
      stageId
        ? state.groups.byStage[stageId]
          ? state.groups.byStage[stageId].map((id) => state.groups.byId[id])
          : []
        : [],
    shallowEqual
  );
}

export function useIsStageAdmin(): boolean {
  return useSelector<NormalizedState, boolean>((state) =>
    state.stageId ? state.stages.byId[state.stageId].isAdmin : false
  );
}

export function useStageMembers(): ExtendedStageMember[] {
  const stageMembers = useSelector<NormalizedState, StageMembers>(
    (state) => state.stageMembers,
    shallowEqual
  );
  const users = useSelector<NormalizedState, Users>((state) => state.users, shallowEqual);
  const videoConsumers = useSelector<NormalizedState, VideoConsumers>(
    (state) => state.videoConsumers,
    shallowEqual
  );
  const audioConsumers = useSelector<NormalizedState, AudioConsumers>(
    (state) => state.audioConsumers,
    shallowEqual
  );
  const ovTracks = useSelector<NormalizedState, OvTracks>((state) => state.ovTracks, shallowEqual);
  return stageMembers.allIds
    .map((id) => stageMembers.byId[id])
    .map((stageMember) => {
      return {
        ...stageMember,
        name: users.byId[stageMember.userId] ? users.byId[stageMember.userId].name : '',
        avatarUrl: users.byId[stageMember.userId] ? users.byId[stageMember.userId].avatarUrl : '',
        videoConsumers: videoConsumers.byStageMember[stageMember._id]
          ? videoConsumers.byStageMember[stageMember._id].map((id) => videoConsumers.byId[id])
          : [],
        audioConsumers: audioConsumers.byStageMember[stageMember._id]
          ? audioConsumers.byStageMember[stageMember._id].map((id) => audioConsumers.byId[id])
          : [],
        ovTracks: ovTracks.byStageMember[stageMember._id]
          ? ovTracks.byStageMember[stageMember._id].map((id) => ovTracks.byId[id])
          : [],
      };
    });
}

export function useStageMembersByStage(stageId: string): ExtendedStageMember[] {
  const stageMembers = useStageMembers();
  return stageMembers.filter((stageMember) => stageMember.stageId === stageId);
}

export function useStageMembersByGroup(groupId: string): ExtendedStageMember[] {
  const stageMembers = useStageMembers();
  return stageMembers.filter((stageMember) => stageMember.groupId === groupId);
}

export function useConductors(): ExtendedStageMember[] {
  const stageMembers = useStageMembers();
  return stageMembers.filter((stageMember) => stageMember.isDirector);
}

export default useStageSelector;
