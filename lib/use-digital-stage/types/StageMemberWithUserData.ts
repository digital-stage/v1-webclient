import { StageMember } from './StageMember';

export type StageMemberWithUserData = StageMember & {
  name?: string;
  avatarUrl?: string;
};
