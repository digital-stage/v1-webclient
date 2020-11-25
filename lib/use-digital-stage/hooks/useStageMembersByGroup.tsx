import { useSelector } from 'react-redux';
import { RootReducer, StageMemberWithUserData } from '../types';

const useStageMembersByStage = (groupId: string): StageMemberWithUserData[] =>
  useSelector<RootReducer, StageMemberWithUserData[]>((state) =>
    state.stageMembers.byGroup[groupId]
      ? state.stageMembers.byGroup[groupId].map((id) => {
          const stageMember = state.stageMembers.byId[id];
          const user = state.users.byId[stageMember.userId];
          if (user) {
            return {
              ...stageMember,
              name: user.name,
              avatarUrl: user.avatarUrl,
            };
          }
          return stageMember;
        })
      : []
  );
export default useStageMembersByStage;
