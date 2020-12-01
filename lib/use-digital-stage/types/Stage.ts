export interface Stage {
  _id: string;
  name: string;

  // SETTINGS
  admins: string[];
  password?: string;
  // 3D Room specific
  width: number;
  length: number;
  height: number;
  absorption: number;
  damping: number;

  ov?: {
    routerId: string;
    port: number;
  };
}
