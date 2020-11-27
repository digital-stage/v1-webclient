import React, { Context, createContext, useContext, useEffect, useState } from 'react';
import {
  AudioContext as StandardizedAudioContext,
  IAudioContext,
} from 'standardized-audio-context';
import debug from 'debug';

const d = debug('useAudioContext');

export interface TAudioContext {
  audioContext?: IAudioContext;
  started: boolean;
}

const AudioContext: Context<TAudioContext> = createContext<TAudioContext>(undefined);

export const AudioContextProvider = (props: { children: React.ReactNode }): JSX.Element => {
  const { children } = props;
  const [audioContext, setAudioContext] = useState<IAudioContext>(undefined);
  const [started, setStarted] = useState<boolean>(false);

  useEffect(() => {
    const standardizedAudioContext = new StandardizedAudioContext();
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

export const useAudioContext = (): TAudioContext => useContext<TAudioContext>(AudioContext);
