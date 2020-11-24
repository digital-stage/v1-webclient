export interface User {
  _id: string;
  uid?: string;

  // SETTINGS
  name: string;
  avatarUrl?: string;

  stageId?: string; // <--- RELATION
  stageMemberId?: string; // <--- RELATION
}
