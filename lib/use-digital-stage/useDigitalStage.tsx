import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import debug from 'debug';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import useSocket, { SocketProvider } from './useSocket';
import { Router } from './types';
import reducer from './redux/reducers/index';
import useStageActions, { StageActionsProvider } from './useStageActions';
import Status, { IStatus } from './useSocket/Status';
import { useLocalDevice } from './hooks';
import { MediasoupProvider } from './useMediasoup';
import getLocalMediaDevices from './utils/getLocalMediaDevices';
import getInitialDevice from './utils/getInitialDevice';

const d = debug('useDigitalStage');
const trace = d.extend('trace');
const debugEffect = debug('useEffect:useDigitalStage');

export interface TDigitalStageContext {
  router?: Router;
  ready: boolean;
  status: IStatus[keyof IStatus];
  refreshLocalDevice: () => void;
}

const throwAddProviderError = () => {
  throw new Error('Please wrap the DOM tree with the StageActionProvider');
};

const DigitalStageContext = createContext<TDigitalStageContext>({
  ready: false,
  status: Status.disconnected,
  refreshLocalDevice: throwAddProviderError,
});

const UseDigitalStageProvider = (props: {
  children: React.ReactNode;
  token?: string;
  handleError: (error: Error) => void;
}) => {
  const { children, token, handleError } = props;
  const { status, connect, disconnect } = useSocket();
  const [ready, setReady] = useState<boolean>(!!token && status === Status.connected);
  const { updateDevice } = useStageActions();
  const localDevice = useLocalDevice();

  const refreshLocalDevice = useCallback(() => {
    if (ready && localDevice) {
      getLocalMediaDevices(localDevice)
        .then((mediaDevices) => {
          return updateDevice(localDevice._id, {
            ...mediaDevices,
          });
        })
        .catch((error) => {
          handleError(error);
        });
    }
  }, [ready, localDevice, updateDevice, handleError]);

  useEffect(() => {
    debugEffect('refreshLocalDevice');
    if (navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener('devicechange', refreshLocalDevice);
      return () => {
        navigator.mediaDevices.removeEventListener('devicechange', refreshLocalDevice);
      };
    }
    return undefined;
  }, [refreshLocalDevice]);

  useEffect(() => {
    debugEffect('token, status');
    if (token && handleError) {
      if (status === Status.disconnected) {
        trace('Got token, but not connected, connecting...');
        getInitialDevice()
          .then((initialDevice) => connect(token, initialDevice))
          .then(() => setReady(true))
          .catch((connError) => {
            d(connError);
            handleError(connError)
          });
      }
    } else if (status === Status.connected) {
      trace('No token, disconnecting...');
      disconnect();
    }
  }, [token, status, handleError]);

  return (
    <DigitalStageContext.Provider
      value={{
        ready,
        status: status || Status.disconnected,
        refreshLocalDevice,
      }}
    >
      {children}
    </DigitalStageContext.Provider>
  );
};
UseDigitalStageProvider.defaultProps = {
  token: undefined,
};

const store = createStore(reducer, devToolsEnhancer({}));

const DigitalStageProvider = (props: {
  children: React.ReactNode;
  apiUrl: string;
  routerDistributorUrl?: string;
  standaloneRouterUrl?: string;
  token?: string;
  addErrorHandler?: (error: Error) => void;
}): JSX.Element => {
  const {
    children,
    token,
    apiUrl,
    routerDistributorUrl,
    standaloneRouterUrl,
    addErrorHandler,
  } = props;

  const handleError = useCallback(
    (error: Error) => {
      if (addErrorHandler) {
        addErrorHandler(error);
      } else {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    [addErrorHandler]
  );

  return (
    <Provider store={store}>
      <SocketProvider apiUrl={apiUrl}>
        <StageActionsProvider handleError={handleError}>
          <UseDigitalStageProvider handleError={handleError} token={token}>
            <MediasoupProvider
              routerDistributorUrl={routerDistributorUrl}
              standaloneRouterUrl={standaloneRouterUrl}
            >
              {children}
            </MediasoupProvider>
          </UseDigitalStageProvider>
        </StageActionsProvider>
      </SocketProvider>
    </Provider>
  );
};
DigitalStageProvider.defaultProps = {
  token: undefined,
  addErrorHandler: undefined,
};

export { DigitalStageProvider };

const useDigitalStage = (): TDigitalStageContext =>
  useContext<TDigitalStageContext>(DigitalStageContext);

export default useDigitalStage;
