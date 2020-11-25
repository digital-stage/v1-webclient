export interface SoundCard {
  // ov-specific
  _id: string;
  userId: string;

  name: string; // unique together with deviceId

  driver: 'JACK' | 'ALSA' | 'ASIO' | 'WEBRTC';

  numInputChannels: number;
  numOutputChannels: number;

  trackPreset?: string; // Current default preset (outside or on new stages)

  sampleRate: number;
  periodSize: number;
  numPeriods: number; // default to 2

  // Optimizations for performance
  // trackPresets: TrackPresetId[];
}
