export type IStatus = 'disconnected' | 'connecting' | 'connected';

const Status: {
  disconnected: IStatus;
  connecting: IStatus;
  connected: IStatus;
} = {
  disconnected: 'disconnected',
  connecting: 'connecting',
  connected: 'connected',
};

export default Status;
