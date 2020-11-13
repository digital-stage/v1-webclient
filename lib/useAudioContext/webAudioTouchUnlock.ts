import { IAudioContext } from 'standardized-audio-context';

export default function webAudioTouchUnlock(context: IAudioContext): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    /* if (!context || !(context instanceof ((<any>window).AudioContext ||  || (<any>window).webkitAudioContext))) {
            reject('WebAudioTouchUnlock: You need to pass an instance of AudioContext to this method call');
            return;
        } */

    if (context.state === 'suspended' && 'ontouchstart' in window) {
      const unlock = (): void => {
        context.resume().then(
          () => {
            document.body.removeEventListener('touchstart', unlock);
            document.body.removeEventListener('touchend', unlock);

            resolve(true);
          },
          (reason) => {
            reject(reason);
          }
        );
      };

      document.body.addEventListener('touchstart', unlock, false);
      document.body.addEventListener('touchend', unlock, false);
    } else {
      resolve(false);
    }
  });
}
