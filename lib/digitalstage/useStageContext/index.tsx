import React, { useCallback, useEffect, useState } from 'react';
import * as Bowser from 'bowser';
import { useAuth } from '../useAuth';
import {
  ServerDeviceEvents,
  ServerGlobalEvents,
  ServerStageEvents,
  ServerUserEvents,
} from '../common/events';
import * as Server from '../common/model.server';
import enumerateDevices from './utils';
import { Device } from '../common/model.server';
import allActions from './redux/actions';
import { useDispatch } from './redux';
import { useErrors } from '../../useErrors';
import TeckosClientWithJWT from '../../websocket/TeckosClientWithJWT';
import TeckosClient from '../../websocket/TeckosClient';

const SocketContext = React.createContext<TeckosClient>(undefined);

export const useSocket = ()
: TeckosClient => React.useContext<TeckosClient>(SocketContext);

export const SocketContextProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const { token } = useAuth();
  const [socket, setSocket] = useState<TeckosClient>(null);
  const dispatch = useDispatch();
  const { reportError } = useErrors();

  const registerSocketHandlers = useCallback(
    (currSocket) => {
      console.log('[useStages] Registering currSocket handlers');

      currSocket.on(ServerGlobalEvents.READY, () => {
        dispatch(allActions.server.setReady());
      });

      currSocket.on(
        ServerDeviceEvents.LOCAL_DEVICE_READY,
        (payload: Server.Device) => {
          dispatch(
            allActions.deviceActions.server.handleLocalDeviceReady(payload),
          );
        },
      );

      currSocket.on(ServerUserEvents.USER_READY, (payload: Server.User) => {
        dispatch(allActions.server.handleUserReady(payload));
      });

      currSocket.on(ServerDeviceEvents.DEVICE_ADDED, (payload: Server.Device) => {
        dispatch(allActions.deviceActions.server.addDevice(payload));
      });
      currSocket.on(ServerDeviceEvents.DEVICE_CHANGED, (payload: Server.Device) => {
        dispatch(allActions.deviceActions.server.changeDevice(payload));
      });
      currSocket.on(
        ServerDeviceEvents.DEVICE_REMOVED,
        (payload: Server.DeviceId) => {
          dispatch(allActions.deviceActions.server.removeDevice(payload));
        },
      );

      currSocket.on(ServerStageEvents.USER_ADDED, (payload: Server.User) => {
        dispatch(allActions.stageActions.server.addUser(payload));
      });
      currSocket.on(ServerStageEvents.USER_CHANGED, (payload: Server.User) => {
        dispatch(allActions.stageActions.server.changeUser(payload));
      });
      currSocket.on(ServerStageEvents.USER_REMOVED, (payload: Server.UserId) => {
        dispatch(allActions.stageActions.server.removeUser(payload));
      });

      currSocket.on(ServerStageEvents.STAGE_ADDED, (payload: Server.Stage) => {
        dispatch(allActions.stageActions.server.addStage(payload));
      });
      currSocket.on(
        ServerStageEvents.STAGE_JOINED,
        (payload: Server.InitialStagePackage) => {
          dispatch(allActions.stageActions.server.handleStageJoined(payload));
        },
      );
      currSocket.on(ServerStageEvents.STAGE_LEFT, () => {
        dispatch(allActions.stageActions.server.handleStageLeft());
      });
      currSocket.on(ServerStageEvents.STAGE_CHANGED, (payload: Server.Stage) => {
        dispatch(allActions.stageActions.server.changeStage(payload));
      });
      currSocket.on(ServerStageEvents.STAGE_REMOVED, (payload: Server.UserId) => {
        dispatch(allActions.stageActions.server.removeStage(payload));
      });

      currSocket.on(ServerStageEvents.GROUP_ADDED, (payload: Server.Group) => {
        dispatch(allActions.stageActions.server.addGroup(payload));
      });
      currSocket.on(ServerStageEvents.GROUP_CHANGED, (payload: Server.Group) => {
        dispatch(allActions.stageActions.server.changeGroup(payload));
      });
      currSocket.on(ServerStageEvents.GROUP_REMOVED, (payload: Server.GroupId) => {
        dispatch(allActions.stageActions.server.removeGroup(payload));
      });

      currSocket.on(
        ServerStageEvents.CUSTOM_GROUP_ADDED,
        (payload: Server.CustomGroup) => {
          dispatch(allActions.stageActions.server.addCustomGroup(payload));
        },
      );
      currSocket.on(
        ServerStageEvents.CUSTOM_GROUP_CHANGED,
        (payload: Server.CustomGroup) => {
          dispatch(allActions.stageActions.server.changeCustomGroup(payload));
        },
      );
      currSocket.on(
        ServerStageEvents.CUSTOM_GROUP_REMOVED,
        (payload: Server.CustomGroupId) => {
          dispatch(allActions.stageActions.server.removeCustomGroup(payload));
        },
      );

      currSocket.on(
        ServerStageEvents.STAGE_MEMBER_ADDED,
        (payload: Server.StageMember) => {
          dispatch(allActions.stageActions.server.addStageMember(payload));
        },
      );
      currSocket.on(
        ServerStageEvents.STAGE_MEMBER_CHANGED,
        (payload: Server.StageMember) => {
          dispatch(allActions.stageActions.server.changeStageMember(payload));
        },
      );
      currSocket.on(
        ServerStageEvents.STAGE_MEMBER_REMOVED,
        (payload: Server.StageMemberId) => {
          dispatch(allActions.stageActions.server.removeStageMember(payload));
        },
      );

      currSocket.on(
        ServerStageEvents.CUSTOM_STAGE_MEMBER_ADDED,
        (payload: Server.CustomStageMember) => {
          dispatch(
            allActions.stageActions.server.addCustomStageMember(payload),
          );
        },
      );
      currSocket.on(
        ServerStageEvents.CUSTOM_STAGE_MEMBER_CHANGED,
        (payload: Server.CustomStageMember) => {
          dispatch(
            allActions.stageActions.server.changeCustomStageMember(payload),
          );
        },
      );
      currSocket.on(
        ServerStageEvents.CUSTOM_STAGE_MEMBER_REMOVED,
        (payload: Server.CustomStageMemberId) => {
          dispatch(
            allActions.stageActions.server.removeCustomStageMember(payload),
          );
        },
      );

      currSocket.on(
        ServerStageEvents.STAGE_MEMBER_VIDEO_ADDED,
        (payload: Server.StageMemberVideoProducer) => {
          dispatch(allActions.stageActions.server.addVideoProducer(payload));
        },
      );
      currSocket.on(
        ServerStageEvents.STAGE_MEMBER_VIDEO_CHANGED,
        (payload: Server.StageMemberVideoProducer) => {
          dispatch(allActions.stageActions.server.changeVideoProducer(payload));
        },
      );
      currSocket.on(
        ServerStageEvents.STAGE_MEMBER_VIDEO_REMOVED,
        (payload: Server.StageMemberVideoProducerId) => {
          dispatch(allActions.stageActions.server.removeVideoProducer(payload));
        },
      );

      currSocket.on(
        ServerStageEvents.STAGE_MEMBER_AUDIO_ADDED,
        (payload: Server.StageMemberAudioProducer) => {
          dispatch(allActions.stageActions.server.addAudioProducer(payload));
        },
      );
      currSocket.on(
        ServerStageEvents.STAGE_MEMBER_AUDIO_CHANGED,
        (payload: Server.StageMemberAudioProducer) => {
          dispatch(allActions.stageActions.server.changeAudioProducer(payload));
        },
      );
      currSocket.on(
        ServerStageEvents.STAGE_MEMBER_AUDIO_REMOVED,
        (payload: Server.StageMemberAudioProducerId) => {
          dispatch(allActions.stageActions.server.removeAudioProducer(payload));
        },
      );

      currSocket.on(
        ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_ADDED,
        (payload: Server.CustomStageMemberAudioProducer) => {
          dispatch(
            allActions.stageActions.server.addCustomAudioProducer(payload),
          );
        },
      );
      currSocket.on(
        ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_CHANGED,
        (payload: Server.CustomStageMemberAudioProducer) => {
          dispatch(
            allActions.stageActions.server.changeCustomAudioProducer(payload),
          );
        },
      );
      currSocket.on(
        ServerStageEvents.CUSTOM_STAGE_MEMBER_AUDIO_REMOVED,
        (payload: Server.CustomStageMemberAudioProducerId) => {
          dispatch(
            allActions.stageActions.server.removeCustomAudioProducer(payload),
          );
        },
      );

      currSocket.on(
        ServerStageEvents.STAGE_MEMBER_OV_ADDED,
        (payload: Server.StageMemberOvTrack) => {
          dispatch(allActions.stageActions.server.addOvTrack(payload));
        },
      );
      currSocket.on(
        ServerStageEvents.STAGE_MEMBER_OV_CHANGED,
        (payload: Server.StageMemberOvTrack) => {
          dispatch(allActions.stageActions.server.changeOvTrack(payload));
        },
      );
      currSocket.on(
        ServerStageEvents.STAGE_MEMBER_OV_REMOVED,
        (payload: Server.StageMemberOvTrackId) => {
          dispatch(allActions.stageActions.server.removeOvTrack(payload));
        },
      );

      currSocket.on(
        ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_ADDED,
        (payload: Server.CustomStageMemberOvTrack) => {
          dispatch(allActions.stageActions.server.addCustomOvTrack(payload));
        },
      );
      currSocket.on(
        ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_CHANGED,
        (payload: Server.CustomStageMemberOvTrack) => {
          dispatch(allActions.stageActions.server.changeCustomOvTrack(payload));
        },
      );
      currSocket.on(
        ServerStageEvents.CUSTOM_STAGE_MEMBER_OV_REMOVED,
        (payload: Server.CustomStageMemberOvTrackId) => {
          dispatch(allActions.stageActions.server.removeCustomOvTrack(payload));
        },
      );
    },
    [dispatch],
  );

  const createSocket = useCallback(() => {
    const bowser = Bowser.getParser(window.navigator.userAgent);
    const os = bowser.getOSName();
    const browser = bowser.getBrowserName();

    enumerateDevices()
      .then((devices) => {
        let inputAudioDeviceId;
        let outputAudioDeviceId;
        let inputVideoDeviceId = 'default';
        if (devices.inputAudioDevices.find((d) => d.id === 'label')) {
          inputAudioDeviceId = 'default';
        } else if (devices.inputAudioDevices.length > 0) {
          inputAudioDeviceId = devices.inputAudioDevices[0].id;
        }
        if (devices.outputAudioDevices.find((d) => d.id === 'label')) {
          outputAudioDeviceId = 'default';
        } else if (devices.outputAudioDevices.length > 0) {
          outputAudioDeviceId = devices.outputAudioDevices[0].id;
        }
        if (devices.inputVideoDevices.length === 1) {
          inputVideoDeviceId = devices.inputVideoDevices[0].id;
        }

        const createdSocket = new TeckosClientWithJWT(process.env.NEXT_PUBLIC_API_URL, token, {
          // secure: process.env.NODE_ENV !== "development",
          device: JSON.stringify({
            name: `${browser} (${os})`,
            canAudio: devices.inputAudioDevices.length > 0,
            canVideo: devices.inputVideoDevices.length > 0,
            receiveVideo: true,
            receiveAudio: true,
            inputAudioDevices: devices.inputAudioDevices,
            inputVideoDevices: devices.inputVideoDevices,
            outputAudioDevices: devices.outputAudioDevices,
            inputAudioDeviceId,
            inputVideoDeviceId,
            outputAudioDeviceId,
          } as Device),
        });

        registerSocketHandlers(createdSocket);

        createdSocket.on('reconnect', () => {
          console.debug('[useStageContext] Reconnected!');
        });
        createdSocket.on('disconnect', () => {
          console.debug(
            '[useStageContext] Disconnected from server, try to reconnect',
          );
        });

        setSocket(createdSocket);
      })
      .catch((error) => reportError(error.message));
  }, [token]);

  useEffect(() => {
    if (socket) {
      return () => {
        socket.removeAllListeners();
        socket.close();
        setSocket(undefined);
        dispatch(allActions.client.reset());
      };
    }
    return null;
  }, [socket]);

  useEffect(() => {
    if (token) {
      createSocket();
    } else {
      setSocket(undefined);
    }
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
