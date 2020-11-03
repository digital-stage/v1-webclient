import React from 'react';
import { useStyletron } from 'baseui';
import { useAuth } from '../../../lib/digitalstage/useAuth';
import MobileMenu from '../../navigation/MobileMenu';
import LocalDeviceControl from '../LocalDeviceControl';
import StageOrMixerSwitcher from '../../elements/sticky/StageOrMixerSwitcher';
import AudioPlaybackStarter from '../../elements/sticky/AudioPlaybackStarter';
import ProfileIcon from '../../elements/sticky/ProfileIcon';
import SideNavigation from '../SideNavigation';

const PageWrapper = (props: {
  children: React.ReactNode
}) => {
  const { children } = props;
  const { user } = useAuth();
  const [css, theme] = useStyletron();

  return (
    <div className={css({
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      [theme.mediaQuery.large]: {
        flexDirection: user ? 'row' : 'column',
      },
    })}
    >
      {user && (
        <>
          <div className={css({
            display: 'none',
            [theme.mediaQuery.large]: {
              display: 'flex',
            },
          })}
          >
            <SideNavigation />
          </div>
          <div className={css({
            display: 'block',
            width: '100%',
            [theme.mediaQuery.large]: {
              display: 'none',
            },
          })}
          >
            <MobileMenu />
          </div>
        </>
      )}
      <main className={css({
        flexGrow: 1,
        flexShrink: 0,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      })}
      >
        {children}
      </main>

      <LocalDeviceControl />

      <StageOrMixerSwitcher />

      <AudioPlaybackStarter />

      <ProfileIcon />
    </div>
  );
};
export default PageWrapper;
