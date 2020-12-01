import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as Bowser from 'bowser';
import debug from 'debug';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import useSocket, { SocketProvider } from './useSocket';
import { Device, Router, WebRTCDevice } from './types';
import enumerateDevices from './utils/enumerateDevices';
import reducer from './redux/reducers/index';
import useStageActions, { StageActionsProvider, TStageActionContext } from './useStageActions';
import Status, { IStatus } from './useSocket/Status';
import useWebRTCCommunication, { WebRTCCommunicationProvider } from './useWebRTCCommunication';
import { useLocalDevice } from './hooks';

const dbg = debug('useDigitalStage:provider');

export interface TDigitalStageContext {
  router?: Router;
  ready: boolean;
  actions?: TStageActionContext;
  status: IStatus[keyof IStatus];
  refreshLocalDevice: () => void;
}

interface LocalAudioAndVideoDevices {
  inputAudioDeviceId?: string;
  inputVideoDeviceId?: string;
  outputAudioDeviceId?: string;
  inputAudioDevices: WebRTCDevice[];
  inputVideoDevices: WebRTCDevice[];
  outputAudioDevices: WebRTCDevice[];
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
  const [ready, setReady] = useState<boolean>(!token);
  const socketAPI = useSocket();
  const actions = useStageActions();
  const { router } = useWebRTCCommunication();
  const localDevice = useLocalDevice();

  const getLocalAudioAndVideoDevices = useCallback(
    (currentLocalDevice?: Device): Promise<LocalAudioAndVideoDevices> => {
      return enumerateDevices().then(
        (mediaDevices): LocalAudioAndVideoDevices => {
          let inputAudioDeviceId: string | undefined;
          let outputAudioDeviceId: string | undefined;
          let inputVideoDeviceId: string | undefined;

          if (currentLocalDevice) {
            // Attach current ids if available
            if (
              currentLocalDevice.inputAudioDeviceId &&
              mediaDevices.inputAudioDevices.find(
                (d) => d.id === currentLocalDevice.inputAudioDeviceId
              )
            ) {
              inputAudioDeviceId = currentLocalDevice.inputAudioDeviceId;
            }
            if (
              currentLocalDevice.outputAudioDeviceId &&
              mediaDevices.outputAudioDevices.find(
                (d) => d.id === currentLocalDevice.outputAudioDeviceId
              )
            ) {
              outputAudioDeviceId = currentLocalDevice.outputAudioDeviceId;
            }
            if (
              currentLocalDevice.inputVideoDeviceId &&
              mediaDevices.inputVideoDevices.find(
                (d) => d.id === currentLocalDevice.inputVideoDeviceId
              )
            ) {
              inputVideoDeviceId = currentLocalDevice.inputVideoDeviceId;
            }
          }

          if (!inputAudioDeviceId && mediaDevices.inputAudioDevices.find((d) => d.id === 'label')) {
            inputAudioDeviceId = 'default';
          } else if (mediaDevices.inputAudioDevices.length > 0) {
            inputAudioDeviceId = mediaDevices.inputAudioDevices[0].id;
          }
          if (
            !outputAudioDeviceId &&
            mediaDevices.outputAudioDevices.find((d) => d.id === 'label')
          ) {
            outputAudioDeviceId = 'default';
          } else if (mediaDevices.outputAudioDevices.length > 0) {
            outputAudioDeviceId = mediaDevices.outputAudioDevices[0].id;
          }
          if (!inputVideoDeviceId && mediaDevices.inputVideoDevices.length > 1) {
            if (mediaDevices.inputVideoDevices.length > 1) {
              inputVideoDeviceId = mediaDevices.inputVideoDevices[0].id;
            } else {
              inputVideoDeviceId = 'default';
            }
          }
          return {
            inputAudioDeviceId,
            inputVideoDeviceId,
            outputAudioDeviceId,
            inputVideoDevices: mediaDevices.inputVideoDevices,
            inputAudioDevices: mediaDevices.inputAudioDevices,
            outputAudioDevices: mediaDevices.outputAudioDevices,
          };
        }
      );
    },
    []
  );

  const createInitialDevice = useCallback((): Promise<Partial<Device>> => {
    return getLocalAudioAndVideoDevices().then(
      (mediaDevices): Partial<Device> => {
        const bowser = Bowser.getParser(window.navigator.userAgent);
        const os = bowser.getOSName();
        const browser = bowser.getBrowserName();
        return {
          ...mediaDevices,
          name: `${browser} (${os})`,
          canAudio: mediaDevices.inputAudioDevices.length > 0,
          canVideo: mediaDevices.inputVideoDevices.length > 0,
          receiveVideo: true,
          receiveAudio: true,
        };
      }
    );
  }, [getLocalAudioAndVideoDevices]);

  const refreshLocalDevice = useCallback(() => {
    if (localDevice) {
      console.debug('DEVICE REFRESHED');
      getLocalAudioAndVideoDevices(localDevice)
        .then((mediaDevices) => {
          return actions.updateDevice(localDevice._id, {
            ...mediaDevices,
          });
        })
        .catch((error) => {
          handleError(error);
        });
    }
  }, [localDevice, getLocalAudioAndVideoDevices, actions, handleError]);

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
  }, [token, handleError, createInitialDevice, socketAPI.status]);

  useEffect(() => {
    if (ready) {
      navigator.mediaDevices.addEventListener('devicechange', refreshLocalDevice);
      return () => {
        navigator.mediaDevices.removeEventListener('devicechange', refreshLocalDevice);
      };
    }
    return undefined;
  }, [ready]);

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
