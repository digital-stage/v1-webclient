import { Device, WebRTCDevice } from '../types';
import enumerateDevices from './enumerateDevices';

export interface LocalMediaDevices {
  inputAudioDeviceId?: string;
  inputVideoDeviceId?: string;
  outputAudioDeviceId?: string;
  inputAudioDevices: WebRTCDevice[];
  inputVideoDevices: WebRTCDevice[];
  outputAudioDevices: WebRTCDevice[];
}

const getLocalMediaDevices = (currentLocalDevice?: Device): Promise<LocalMediaDevices> => {
  return enumerateDevices().then(
    (mediaDevices): LocalMediaDevices => {
      let inputAudioDeviceId: string | undefined;
      let outputAudioDeviceId: string | undefined;
      let inputVideoDeviceId: string | undefined;

      if (currentLocalDevice) {
        // Attach current ids if available
        if (
          currentLocalDevice.inputAudioDeviceId &&
          mediaDevices.inputAudioDevices.find((d) => d.id === currentLocalDevice.inputAudioDeviceId)
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
          mediaDevices.inputVideoDevices.find((d) => d.id === currentLocalDevice.inputVideoDeviceId)
        ) {
          inputVideoDeviceId = currentLocalDevice.inputVideoDeviceId;
        }
      }

      if (!inputAudioDeviceId && mediaDevices.inputAudioDevices.find((d) => d.id === 'label')) {
        inputAudioDeviceId = 'default';
      } else if (mediaDevices.inputAudioDevices.length > 0) {
        inputAudioDeviceId = mediaDevices.inputAudioDevices[0].id;
      }
      if (!outputAudioDeviceId && mediaDevices.outputAudioDevices.find((d) => d.id === 'label')) {
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
};
export default getLocalMediaDevices;
