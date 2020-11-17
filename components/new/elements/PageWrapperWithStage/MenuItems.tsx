/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx } from 'theme-ui';
import { FaVideo, FaVolumeUp, FaBug, FaUserAlt, FaCog } from 'react-icons/fa';
import { MdFeedback } from 'react-icons/md';
import { GoSettings } from 'react-icons/go';
import NavItem from '../Menu/NavItem';
import MixerPane from '../../panes/MixerPane';
import AudioSettings from '../../../settings/AudioSettings';
import VideoSettings from '../../../settings/VideoSettings';
import Profile from '../../../settings/Profile';

// TODO translate to German
// TODO content and href
export const CenteredNavItems: NavItem[] = [
  {
    label: 'Video',
    icon: <FaVideo name="settings" />,
    href: 'video',
    content: <VideoSettings />,
    size: 'small',
  },
  {
    label: 'Audio',
    icon: <FaVolumeUp name="settings" />,
    href: 'audio',
    content: <AudioSettings />,
    size: 'small',
  },
  {
    label: 'Mixer',
    icon: <GoSettings name="mixer" />,
    href: 'mixer',
    content: <MixerPane />,
    size: 'large',
  },
];

export const LowerNavItems: NavItem[] = [
  {
    label: 'Report Bug',
    icon: <FaBug name="bug" />,
    href: 'bug',
    size: 'large',
  },
];

export const AppBarItems: NavItem[] = [
  {
    label: 'Edit profile',
    icon: <FaUserAlt name="edit" />,
    href: 'profile',
    content: <Profile />,
    size: 'large',
  },
  {
    label: 'Settings',
    icon: <FaCog name="settings" />,
    href: 'video',
    content: <VideoSettings />,
    size: 'large',
  },
  {
    label: 'Give feedback',
    icon: <MdFeedback name="feedback" />,
    href: 'feedback',
    size: 'large',
  },
];

export const SettingsModalItems: NavItem[] = [
  {
    label: 'Video',
    icon: <FaVideo name="settings" />,
    href: 'video',
    content: <VideoSettings />,
    size: 'small',
  },
  {
    label: 'Audio',
    icon: <FaVolumeUp name="settings" />,
    href: 'audio',
    content: <AudioSettings />,
    size: 'small',
  },
  {
    label: 'Profile',
    icon: <FaUserAlt name="profile" />,
    href: 'profile',
    content: <Profile />,
    size: 'large',
  },
];
