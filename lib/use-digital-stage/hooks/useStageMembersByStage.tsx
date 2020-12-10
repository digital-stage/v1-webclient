import { shallowEqual, useSelector } from 'react-redux';
import { RootReducer, StageMemberWithUserData } from '../types';

const useStageMembersByStage = (stageId: string): StageMemberWithUserData[] =>
  useSelector<RootReducer, StageMemberWithUserData[]>(
    (state) =>
      state.stageMembers.byStage[stageId]
        ? state.stageMembers.byStage[stageId].map((id) => {
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
        : [],
    shallowEqual
  );
export default useStageMembersByStage;
