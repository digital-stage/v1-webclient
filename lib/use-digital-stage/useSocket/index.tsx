import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { TeckosClient, TeckosClientWithJWT } from 'teckos-client';
import debug from 'debug';
import { Device } from '../types';
import useSocketToDispatch from '../redux/useSocketToDispatch';
import Status, { IStatus } from './Status';

const d = debug('useSocket');

export interface TSocketContext {
  error?: Error;

  socket?: TeckosClient;

  connect(token: string, initialDevice: Partial<Device>): Promise<TeckosClient>;

  disconnect(): Promise<void>;

  status: IStatus[keyof IStatus];
}

const SocketContext = React.createContext<TSocketContext>({
  connect: () => Promise.reject(new Error('Not ready')),
  disconnect: () => Promise.reject(new Error('Not ready')),
  status: Status.disconnected,
});

const useSocket = (): TSocketContext => React.useContext<TSocketContext>(SocketContext);

const SocketProvider = (props: { children: React.ReactNode; apiUrl: string }) => {
  const { children, apiUrl } = props;
  const [socket, setSocket] = useState<TeckosClient>();
  const [status, setStatus] = useState<IStatus[keyof IStatus]>(Status.disconnected);
  const handler = useSocketToDispatch();

  const connect = useCallback(
    (token: string, initialDevice: Partial<Device>): Promise<TeckosClient> => {
      return new Promise<TeckosClient>((resolve, reject) => {
        if (!socket) {
          if (status === Status.disconnected) {
            d('Connecting');
            setStatus(Status.connecting);
            const nSocket = new TeckosClientWithJWT(
              apiUrl,
              {
                reconnection: true,
                timeout: 1000,
              },
              token,
              {
                device: initialDevice,
              }
            );
            if (handler) {
              d('Attaching handler to socket');
              handler(nSocket);
            }
            nSocket.on('disconnect', () => {
              d('Disconnected');
              setStatus(Status.connecting);
            });
            nSocket.on('error', (error: Error) => {
              d(`Got error:`);
              d(error);
            });
            nSocket.on('reconnect', () => {
              d(`Reconnected`);
            });
            nSocket.on('connect', () => {
              d('Connected');
              setSocket(nSocket);
              setStatus(Status.connected);
              resolve(nSocket);
            });
            nSocket.connect();
          } else {
            reject(new Error('Already connected'));
          }
        } else {
          reject(new Error('Already created socket connection, try to use promise'));
        }
      });
    },
    [apiUrl, socket, handler, status]
  );

  const disconnect = useCallback(() => {
    if (socket && status === Status.connected) {
      d('Disconnecting');
      return new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error('Timeout'));
        }, 5000);
        socket.removeAllListeners('disconnect');
        socket.once('disconnect', () => {
          clearTimeout(timer);
          setStatus(Status.disconnected);
          setSocket(undefined);
          resolve();
        });
        socket.close();
      });
    }
    throw new Error('Not connected');
  }, [socket, status]);

  const cleanupConnection = useCallback(() => {
    d('Cleaning up socket connection');
    if (socket) {
      if (status === Status.connected) {
        socket.close();
      }
      setStatus(Status.disconnected);
      setSocket(undefined);
    }
  }, [socket, status]);

  useEffect(() => {
    return () => {
      cleanupConnection();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        connect,
        disconnect,
        status,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
export { SocketProvider };

export default useSocket;
