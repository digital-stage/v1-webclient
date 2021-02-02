export interface ChatMessage {
  userId: string;
  stageMemberId: string;
  message: string;
  time: number;
}

export type ChatMessages = ChatMessage[];
