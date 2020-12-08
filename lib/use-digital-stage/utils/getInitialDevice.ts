import * as Bowser from 'bowser';
import getLocalMediaDevices from './getLocalMediaDevices';
import { Device } from '../types';

const getInitialDevice = (): Promise<Partial<Device>> =>
  getLocalMediaDevices().then(
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
export default getInitialDevice;
