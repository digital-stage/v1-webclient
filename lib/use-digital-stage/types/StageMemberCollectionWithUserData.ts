import { StageMembersCollection } from './StageMembersCollection';
import { StageMemberWithUserData } from './StageMemberWithUserData';

interface StageMemberCollectionWithUserData extends StageMembersCollection {
  byId: {
    [id: string]: StageMemberWithUserData;
  };
}
export default StageMemberCollectionWithUserData;
