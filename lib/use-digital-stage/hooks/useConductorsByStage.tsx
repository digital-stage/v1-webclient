import { useSelector } from 'react-redux';
import { RootReducer, StageMemberWithUserData } from '../types';

const useConductorsByStage = (stageId: string): StageMemberWithUserData[] =>
  useSelector<RootReducer, StageMemberWithUserData[]>((state) =>
    state.stageMembers.byStage[stageId]
      ? state.stageMembers.byStage[stageId]
          .filter((id) => state.stageMembers.byId[id].isDirector)
          .map((id) => {
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
export default useConductorsByStage;
