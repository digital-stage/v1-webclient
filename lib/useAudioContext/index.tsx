import React, { Context, createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  AudioContext as StandardizedAudioContext,
  IAudioContext,
} from 'standardized-audio-context';
import debug from 'debug';

const d = debug('useAudioContext');

interface AudioContextProps {
  audioContext?: IAudioContext;
  started?: boolean;
  start: () => void;
  setSinkId: (sinkId: string) => void;
  setSampleRate: (sampleRate?: number) => void;
}

const AudioContext: Context<AudioContextProps> = createContext<AudioContextProps>(undefined);

/**
 * Create audio buffer with fallback for safari
 */
const createBuffer = (sinkId?: string, sampleRate?: number): IAudioContext => {
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
  const [sinkId, setSinkId] = useState<string>();
  const [sampleRate, setSampleRate] = useState<number>();

  useEffect(() => {
    d('(Re)start audio context');
    if (sampleRate) d('Using sample rate of ' + sampleRate);
    if (sinkId) d('Using sink ID ' + sinkId);
    const standardizedAudioContext: IAudioContext = createBuffer(sinkId, sampleRate);
    if (standardizedAudioContext.state === 'suspended') {
      standardizedAudioContext.resume().then(() => {
        d('Started audio context');
        setStarted(true);
      });
    }
    setAudioContext(standardizedAudioContext);
    return () => {
      standardizedAudioContext.close().then(() => {
        d('Closed audio context');
        setStarted(false);
      });
    };
  }, [sinkId, sampleRate]);

  const start = useCallback(() => {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume().then(() => {
        setStarted(true);
      });
    }
  }, [audioContext]);

  useEffect(() => {
    if (audioContext && audioContext.state === 'suspended' && 'ontouchstart' in window) {
      d('Add method to start audio context to touchstart and touchend of body');
      const resume = () => {
        audioContext.resume().then(() => setStarted(true));
      };
      document.body.addEventListener('touchstart', resume, false);
      document.body.addEventListener('touchend', resume, false);
      return () => {
        document.body.removeEventListener('touchstart', resume);
        document.body.removeEventListener('touchend', resume);
      };
    }
  }, [audioContext]);

  /***
   * STATE CHANGE HANDLING
   */
  const handleStateChange = useCallback(() => {
    if (audioContext) {
      setStarted(audioContext.state === 'running');
    } else {
      setStarted(false);
    }
  }, [audioContext]);

  useEffect(() => {
    if (audioContext) {
      audioContext.addEventListener('statechanged', handleStateChange);
      return () => {
        audioContext.removeEventListener('statechanged', handleStateChange);
      };
    }
  }, [audioContext]);

  return (
    <AudioContext.Provider
      value={{
        audioContext,
        started,
        setSinkId,
        start,
        setSampleRate,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

const useAudioContext = (): AudioContextProps => useContext<AudioContextProps>(AudioContext);

export default useAudioContext;
