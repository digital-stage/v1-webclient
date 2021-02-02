import { ServerGlobalEvents, ServerStageEvents } from '../../global/SocketEvents';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';
import { ChatMessage, ChatMessages } from '../../types/ChatMessages';

function chatMessages(
  state: ChatMessages = [],
  action: {
    type: string;
    payload: unknown;
  }
): ChatMessages {
  switch (action.type) {
    case ServerGlobalEvents.STAGE_LEFT:
    case AdditionalReducerTypes.RESET: {
      return [];
    }
    case ServerStageEvents.MESSAGE_SENT: {
      const chatMessage: ChatMessage = action.payload as ChatMessage;
      return [...state, chatMessage];
    }
    default:
      return state;
  }
}

export default chatMessages;
