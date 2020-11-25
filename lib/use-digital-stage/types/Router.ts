export interface Router {
  _id: string;
  wsPrefix: string;
  restPrefix: string;
  url: string;
  path: string;
  ipv4: string;
  ipv6: string;
  port: number;
  availableSlots: number;
  userId: string;
}
