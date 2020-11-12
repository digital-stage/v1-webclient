import React, { Context, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AudioContext as RealAudioContext, IAudioContext } from 'standardized-audio-context';
import webAudioTouchUnlock from './webAudioTouchUnlock';
import { useErrors } from '../useErrors';

interface AudioContextProps {
  audioContext?: IAudioContext;

  createAudioContext(): Promise<IAudioContext>;
}

const AudioContext: Context<AudioContextProps> = createContext<AudioContextProps>(undefined);

export const AudioContextProvider = (props: { children: React.ReactNode }): JSX.Element => {
  const { children } = props;
  const [context, setContext] = useState<IAudioContext>(undefined);
  const { reportError } = useErrors();

  const createAudioContext = useCallback(async () => {
    if (context) {
      return context;
    }
    const audioContext: IAudioContext = new RealAudioContext();

    return webAudioTouchUnlock(audioContext)
      .then(() => audioContext)
      .catch((error) => reportError(error.message));
  }, []);

  useEffect(() => {
    createAudioContext()
      .then((audioContext) => {
        setContext(audioContext);
      })
      .catch((error) => reportError(error.message));
  }, []);

  return (
    <AudioContext.Provider
      value={{
        audioContext: context,
        createAudioContext,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => useContext<AudioContextProps>(AudioContext);
