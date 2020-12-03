import React, { Context, createContext, useContext, useEffect, useState } from 'react';
import {
  AudioContext as StandardizedAudioContext,
  IAudioContext,
} from 'standardized-audio-context';
import debug from 'debug';

const d = debug('useAudioContext');

interface AudioContextProps {
  audioContext?: IAudioContext;
  started?: boolean;
}

const AudioContext: Context<AudioContextProps> = createContext<AudioContextProps>(undefined);

/**
 * Create audio buffer with fallback for safari
 */
const createBuffer = (sampleRate?: number): IAudioContext => {
  const desiredSampleRate: number =
    sampleRate && typeof sampleRate === 'number' ? sampleRate : 44100;
  let context = new StandardizedAudioContext({
    latencyHint: 'interactive',
  });
  if (/(iPhone|iPad)/i.test(navigator.userAgent) && context.sampleRate !== desiredSampleRate) {
    const buffer = context.createBuffer(1, 1, desiredSampleRate);
    const dummy = context.createBufferSource();
    dummy.buffer = buffer;
    dummy.connect(context.destination);
    dummy.start(0);
    dummy.disconnect();

    context.close(); // dispose old context
    context = new StandardizedAudioContext();
  }
  return context;
};

export const AudioContextProvider = (props: { children: React.ReactNode }): JSX.Element => {
  const { children } = props;
  const [audioContext, setAudioContext] = useState<IAudioContext>(undefined);
  const [started, setStarted] = useState<boolean>(false);

  useEffect(() => {
    const sampleRate = process.env.NEXT_PUBLIC_FIXED_SAMPLERATE
      ? parseInt(process.env.NEXT_PUBLIC_FIXED_SAMPLERATE)
      : undefined;
    if (sampleRate) d('Using sample rate of ' + sampleRate);
    const standardizedAudioContext: IAudioContext = createBuffer(sampleRate);
    standardizedAudioContext.addEventListener('statechanged', () => {
      setStarted(standardizedAudioContext.state === 'running');
    });
    setAudioContext(standardizedAudioContext);
    standardizedAudioContext.resume().then(() => {
      d('Audio context running and ready!');
      setStarted(true);
    });

    return () => {
      d('Closing audio context');
      standardizedAudioContext.close();
    };
  }, []);

  useEffect(() => {
    if (audioContext && audioContext.state === 'suspended' && 'ontouchstart' in window) {
      d('Add method to start audio context to touchstart and touchend of body');
      const resume = () => {
        audioContext.resume();
      };
      document.body.addEventListener('touchstart', resume, false);
      document.body.addEventListener('touchend', resume, false);
      return () => {
        document.body.removeEventListener('touchstart', resume);
        document.body.removeEventListener('touchend', resume);
      };
    }
  }, [audioContext]);

  return (
    <AudioContext.Provider
      value={{
        audioContext,
        started,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

const useAudioContext = () => useContext<AudioContextProps>(AudioContext);

export default useAudioContext;
