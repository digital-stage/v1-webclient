import { WebRTCDevice } from './WebRTCDevice';

export interface Device {
  _id: string;
  userId: string;
  online: boolean;
  mac?: string;
  name: string;
  canVideo: boolean;
  canAudio: boolean;
  canOv: boolean;
  sendVideo: boolean;
  sendAudio: boolean;
  receiveVideo: boolean;
  receiveAudio: boolean;

  // WebRTC video device
  inputVideoDevices: WebRTCDevice[];
  inputVideoDeviceId?: string;

  // WebRTC audio device
  inputAudioDevices: WebRTCDevice[];
  inputAudioDeviceId?: string;
  outputAudioDevices: WebRTCDevice[];
  outputAudioDeviceId?: string;

  // WebRTC options
  echoCancellation?: boolean;
  autoGainControl?: boolean;
  noiseSuppression?: boolean;

  // OV SoundCards
  soundCardIds: string[]; // refers to all available sound devices
  soundCardId?: string; // active sound device

  // Optional for ov-based clients
  senderJitter: number;
  receiverJitter: number;

  // Optimizations for performance
  server: string;
}
