import { useSelector } from 'react-redux';
import { RootReducer, StageMemberCollectionWithUserData } from '../types';

const useStageMembers = (): StageMemberCollectionWithUserData =>
  useSelector<RootReducer, StageMemberCollectionWithUserData>((state) => {
    const stageMembers: StageMemberCollectionWithUserData = {
      ...state.stageMembers,
    };
    for (const id in stageMembers.byId) {
      if (stageMembers.byId[id]) {
        const stageMember = stageMembers.byId[id];
        const user = state.users.byId[stageMember.userId];
        if (user) {
          stageMembers.byId[id] = {
            ...stageMember,
            name: user.name,
            avatarUrl: user.avatarUrl,
          };
        }
      }
    }
    return stageMembers;
  });

export default useStageMembers;
