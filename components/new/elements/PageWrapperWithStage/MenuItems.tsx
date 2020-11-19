/** @jsxRuntime classic */
/** @jsx jsx */
import { FaBug, FaCog, FaUserAlt, FaVideo, FaVolumeUp } from 'react-icons/fa';
import { GoSettings } from 'react-icons/go';
import { MdFeedback } from 'react-icons/md';
import { jsx } from 'theme-ui';
import AudioSettings from '../../../settings/AudioSettings';
import Profile from '../../../settings/Profile';
import VideoSettings from '../../../settings/VideoSettings';
import MixerPane from '../../panes/MixerPane';
import NavItem from '../Menu/NavItem';

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
    label: 'Fehler melden',
    icon: <FaBug name="bug" />,
    href: 'bug',
    size: 'large',
  },
];

export const AppBarItems: NavItem[] = [
  {
    label: 'Profil bearbeiten',
    icon: <FaUserAlt name="edit" />,
    href: 'profile',
    content: <Profile />,
    size: 'large',
  },
  {
    label: 'Einstellungen ändern',
    icon: <FaCog name="settings" />,
    href: 'video',
    content: <VideoSettings />,
    size: 'large',
  },
  {
    label: 'Feedback geben',
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
    content: <VideoSettings key="video" />,
    size: 'small',
  },
  {
    label: 'Audio',
    icon: <FaVolumeUp name="settings" />,
    href: 'audio',
    content: <AudioSettings key="audio" />,
    size: 'small',
  },
  {
    label: 'Profil',
    icon: <FaUserAlt name="profile" />,
    href: 'profile',
    content: <Profile key="profil" />,
    size: 'large',
  },
];
