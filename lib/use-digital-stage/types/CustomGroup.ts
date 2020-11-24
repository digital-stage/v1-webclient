/**
 * Each user can overwrite the global group settings with personal preferences
 */
export interface CustomGroup {
  _id: string;
  userId: string; // <--- RELATION
  groupId: string; // <--- RELATION

  // SETTINGS
  volume: number;
  muted: boolean;

  // Optimizations for performance
  stageId: string;
}
