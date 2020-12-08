import React, { Context, createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  AudioContext as StandardizedAudioContext,
  IAudioContext,
} from 'standardized-audio-context';
import debug from 'debug';
import { IMediaStreamAudioDestinationNode } from 'standardized-audio-context/src/interfaces/media-stream-audio-destination-node';

const report = debug('useAudioContext');
const reportWarning = report.extend('warn');

interface AudioContextProps {
  audioContext?: IAudioContext;
  started?: boolean;
  start: () => void;
  destination: IMediaStreamAudioDestinationNode<IAudioContext>;
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
  const [destination, setDestination] = useState<IMediaStreamAudioDestinationNode<IAudioContext>>();
  const [started, setStarted] = useState<boolean>(false);
  const [sinkId, setSinkId] = useState<string>();
  const [sampleRate, setSampleRate] = useState<number>();
  const [audio, setAudio] = useState<HTMLAudioElement>();

  useEffect(() => {
    if (audio) {
      report('useEffect - sinkId | audio');
      if (sinkId && sinkId !== 'default' && (audio as any).sinkId !== undefined) {
        report('Set sink Id to ' + sinkId);
        (audio as HTMLAudioElement & {
          setSinkId(sinkId: string);
        }).setSinkId(sinkId);
      }
    }
  }, [sinkId, audio]);

  useEffect(() => {
    report('useEffect - sampleRate');
    report('(Re)start audio context');
    setStarted(false);
    const standardizedAudioContext: IAudioContext = createBuffer(sinkId);
    if (standardizedAudioContext.state === 'suspended') {
      report('context is still suspended');
      standardizedAudioContext
        .resume()
        .then(() => {
          report('Started audio context direct and automatically');
          setStarted(true);
        })
        .catch((err) => reportWarning(err));
    }
    const createdDestination = standardizedAudioContext.createMediaStreamDestination();
    const createdAudio = new Audio();
    createdAudio.srcObject = createdDestination.stream;
    createdAudio.play().catch((err) => reportWarning(err));
    setAudio(createdAudio);
    setAudioContext(standardizedAudioContext);
    setDestination(createdDestination);
  }, []);
  /*
    useEffect(() => {
        report('useEffect - sampleRate')
        report('(Re)start audio context');
        if (sampleRate) report('Using sample rate of ' + sampleRate);
        const standardizedAudioContext: IAudioContext = createBuffer(sinkId, sampleRate);
        if (standardizedAudioContext.state === 'suspended') {
            standardizedAudioContext.resume()
                .then(() => {
                    report('Started audio context direct and automatically');
                    setStarted(true);
                })
                .catch(err => reportWarning(err));
        }
        const createdDestination = standardizedAudioContext.createMediaStreamDestination();
        const createdAudio = new Audio();
        createdAudio.srcObject = createdDestination.stream;
        createdAudio.play()
            .catch(err => reportWarning(err));
        setAudio(createdAudio);
        setAudioContext(standardizedAudioContext);
        setDestination(createdDestination);

        return () => {
            //createdAudio.srcObject = undefined;
            //createdDestination.disconnect();
            standardizedAudioContext.close().then(() => {
                reportCleanup('Closed audio context');
                setStarted(false);
            });
        };
    }, [sampleRate]);*/

  const start = useCallback(() => {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext
        .resume()
        .then(() => {
          setStarted(true);
          report('Started audio context automatically');
        })
        .catch((err) => reportWarning(err));
    }
  }, [audioContext]);

  useEffect(() => {
    if (audioContext && audioContext.state === 'suspended' && 'ontouchstart' in window) {
      report('Add touch handler to start audio context');
      const resume = () => {
        audioContext
          .resume()
          .then(() => {
            report('Started audio context via touch gesture');
            setStarted(true);
          })
          .catch((err) => reportWarning(err));
      };
      document.body.addEventListener('touchstart', resume, false);
      document.body.addEventListener('touchend', resume, false);
      return () => {
        report('Removed touch handler to start audio context');
        document.body.removeEventListener('touchstart', resume);
        document.body.removeEventListener('touchend', resume);
      };
    }
  }, [audioContext]);

  /***
   * STATE CHANGE HANDLING
   */
  const handleStateChange = useCallback(() => {
    report('Audio context state changed');
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
        destination,
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
