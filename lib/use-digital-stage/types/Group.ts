/**
 * A group can be only modified by admins
 */
export interface Group {
  _id: string;
  name: string;
  stageId: string; // <--- RELATION

  // SETTINGS
  volume: number;
  muted: boolean;
}
