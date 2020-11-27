import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as Bowser from 'bowser';
import debug from 'debug';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import useSocket, { SocketProvider } from './useSocket';
import { Device, Router } from './types';
import enumerateDevices from './utils/enumerateDevices';
import reducer from './redux/reducers/index';
import useStageActions, { StageActionsProvider, TStageActionContext } from './useStageActions';
import Status, { IStatus } from './useSocket/Status';
import useWebRTCCommunication, { WebRTCCommunicationProvider } from './useWebRTCCommunication';

const dbg = debug('useDigitalStage:provider');

export interface TDigitalStageContext {
  router?: Router;
  ready: boolean;
  actions?: TStageActionContext;
  status: IStatus[keyof IStatus];
}

const DigitalStageContext = createContext<TDigitalStageContext>({
  ready: false,
  status: Status.disconnected,
});

const UseDigitalStageProvider = (props: {
  children: React.ReactNode;
  token?: string;
  handleError: (error: Error) => void;
}) => {
  const { children, token, handleError } = props;
  const [ready, setReady] = useState<boolean>(!token);
  const socketAPI = useSocket();
  const actions = useStageActions();
  const { router } = useWebRTCCommunication();

  const createInitialDevice = useCallback((): Promise<Partial<Device>> => {
    return enumerateDevices().then(
      (mediaDevices): Partial<Device> => {
        const bowser = Bowser.getParser(window.navigator.userAgent);
        const os = bowser.getOSName();
        const browser = bowser.getBrowserName();
        let inputAudioDeviceId;
        let outputAudioDeviceId;
        let inputVideoDeviceId = 'default';
        if (mediaDevices.inputAudioDevices.find((d) => d.id === 'label')) {
          inputAudioDeviceId = 'default';
        } else if (mediaDevices.inputAudioDevices.length > 0) {
          inputAudioDeviceId = mediaDevices.inputAudioDevices[0].id;
        }
        if (mediaDevices.outputAudioDevices.find((d) => d.id === 'label')) {
          outputAudioDeviceId = 'default';
        } else if (mediaDevices.outputAudioDevices.length > 0) {
          outputAudioDeviceId = mediaDevices.outputAudioDevices[0].id;
        }
        if (mediaDevices.inputVideoDevices.length === 1) {
          inputVideoDeviceId = mediaDevices.inputVideoDevices[0].id;
        }
        return {
          name: `${browser} (${os})`,
          canAudio: mediaDevices.inputAudioDevices.length > 0,
          canVideo: mediaDevices.inputVideoDevices.length > 0,
          receiveVideo: true,
          receiveAudio: true,
          inputAudioDevices: mediaDevices.inputAudioDevices,
          inputVideoDevices: mediaDevices.inputVideoDevices,
          outputAudioDevices: mediaDevices.outputAudioDevices,
          inputAudioDeviceId,
          inputVideoDeviceId,
          outputAudioDeviceId,
        };
      }
    );
  }, []);

  const startSocketConnection = useCallback(() => {
    if (token && socketAPI) {
      if (socketAPI.status === Status.disconnected) {
        dbg('Connecting to API server with token');
        createInitialDevice()
          .then((initialDevice) => socketAPI.connect(token, initialDevice))
          .then(() => setReady(true))
          .catch((connError) => handleError(connError));
      }
    }
  }, [token, handleError, socketAPI.status]);

  useEffect(() => {
    if (token) {
      startSocketConnection();
    }
  }, [token, startSocketConnection]);

  return (
    <DigitalStageContext.Provider
      value={{
        router,
        ready,
        actions,
        status: socketAPI ? socketAPI.status : Status.disconnected,
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
  routerDistUrl: string;
  token?: string;
  addErrorHandler?: (error: Error) => void;
}): JSX.Element => {
  const { children, token, apiUrl, routerDistUrl, addErrorHandler } = props;

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
          <WebRTCCommunicationProvider handleError={handleError} routerDistUrl={routerDistUrl}>
            <UseDigitalStageProvider handleError={handleError} token={token}>
              {children}
            </UseDigitalStageProvider>
          </WebRTCCommunicationProvider>
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
