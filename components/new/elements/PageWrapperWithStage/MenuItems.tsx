import React from 'react';
import NavItem from '../Menu/NavItem';
import Icon from '../../../../uikit/Icon';
import AudioSettingsPane from '../../panes/AudioSettingsPane';
import VideoSettingsPane from '../../panes/VideoSettingsPane';
import MixerPane from '../../panes/MixerPane';
import SettingsPane from '../../panes/SettingsPane';

export const UpperNavItems: NavItem[] = [
  {
    label: 'Audio settings',
    icon: <Icon name="settings" />,
    href: 'audio',
    content: <AudioSettingsPane />,
    size: 'small'
  },
  {
    label: 'Video settings',
    icon: <Icon name="settings" />,
    href: 'video',
    content: <VideoSettingsPane />,
    size: 'small'
  }
];
export const CenteredNavItems: NavItem[] = [
  {
    label: 'Mixer',
    icon: <Icon name="mixer" />,
    href: 'video',
    content: <MixerPane />,
    size: 'large'
  }
];
export const LowerNavItems: NavItem[] = [
  {
    label: 'Settings',
    icon: <Icon name="settings" />,
    href: 'settings',
    content: <SettingsPane />,
    size: 'large'
  }
];
