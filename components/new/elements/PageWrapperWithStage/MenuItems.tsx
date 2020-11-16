/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx } from 'theme-ui';
import { FaVideo, FaVolumeUp, FaBug, FaUserAlt, FaCog } from 'react-icons/fa';
import { MdFeedback } from 'react-icons/md';
import { GoSettings } from 'react-icons/go';
import NavItem from '../Menu/NavItem';
import AudioSettingsPane from '../../panes/AudioSettingsPane';
import VideoSettingsPane from '../../panes/VideoSettingsPane';
import MixerPane from '../../panes/MixerPane';
import SettingsPane from '../../panes/SettingsPane';

// TODO translate to German
// TODO content and href
export const CenteredNavItems: NavItem[] = [
  {
    label: 'Video',
    icon: <FaVideo name="settings" />,
    href: 'video',
    content: <VideoSettingsPane />,
    size: 'small',
  },
  {
    label: 'Audio',
    icon: <FaVolumeUp name="settings" />,
    href: 'audio',
    content: <AudioSettingsPane />,
    size: 'small',
  },
  {
    label: 'Mixer',
    icon: <GoSettings name="Mixer" />,
    href: 'video',
    content: <MixerPane />,
    size: 'large',
  },
];

export const LowerNavItems: NavItem[] = [
  {
    label: 'Report Bug',
    icon: <FaBug name="bug" />,
    href: '#',
    content: <SettingsPane />,
    size: 'large',
  },
];

export const AppBarItems: NavItem[] = [
  {
    label: 'Edit profile',
    icon: <FaUserAlt name="edit" />,
    href: '#',
    size: 'large',
  },
  {
    label: 'Settings',
    icon: <FaCog name="settings" />,
    href: '#',
    size: 'large',
  },
  {
    label: 'Give feedback',
    icon: <MdFeedback name="feedback" />,
    href: '#',
    size: 'large',
  },
];
