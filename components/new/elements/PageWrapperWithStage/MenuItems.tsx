/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx } from 'theme-ui';
import {
  FaVideo, FaMicrophone, FaMusic, FaCog,
} from 'react-icons/fa';
import NavItem from '../Menu/NavItem';
import AudioSettingsPane from '../../panes/AudioSettingsPane';
import VideoSettingsPane from '../../panes/VideoSettingsPane';
import MixerPane from '../../panes/MixerPane';
import SettingsPane from '../../panes/SettingsPane';

export const UpperNavItems: NavItem[] = [
  {
    label: 'Audio settings',
    icon: <FaMicrophone name="settings" />,
    href: 'audio',
    content: <AudioSettingsPane />,
    size: 'small',
  },
  {
    label: 'Video settings',
    icon: <FaVideo name="settings" />,
    href: 'video',
    content: <VideoSettingsPane />,
    size: 'small',
  },
];

export const CenteredNavItems: NavItem[] = [
  {
    label: 'Mixer',
    icon: <FaMusic name="mixer" />,
    href: 'video',
    content: <MixerPane />,
    size: 'large',
  },
];

export const LowerNavItems: NavItem[] = [
  {
    label: 'Settings',
    icon: <FaCog name="settings" />,
    href: 'settings',
    content: <SettingsPane />,
    size: 'large',
  },
];
