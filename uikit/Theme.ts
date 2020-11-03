import { createDarkTheme } from 'baseui';
import { ThemePrimitives } from 'baseui/theme';

export interface COLOR {
  primary: 'primary';
  secondary: 'secondary';
  tertiary: 'tertiary';
}
export interface SHAPE {
  default: 'default';
  pill: 'pill';
  round: 'round';
  circle: 'circle';
  square: 'square';
}

export interface KIND extends COLOR {
  minimal: 'minimal';
}
export interface SIZE {
  compact: 'compact';
  default: 'default';
  large: 'large';
  mini: 'mini';
}

const primitives: Partial<ThemePrimitives> = {
  accent: 'rgb(242,4,67)',
  accent50: 'rgba(255, 89, 110, 1)',
  accent700: 'rgba(183, 0, 29, 1)',

  mono100: 'rgba(255,255,255,1)',
  mono400: 'rgba(80,80,80,1)',
  mono700: 'rgba(37, 37, 37, 1)',
  mono1000: 'rgba(16, 16, 16, 1)',
};

const overrides = {
  colors: {
    buttonSecondaryFill: primitives.accent100,
    buttonSecondaryText: primitives.accent,
    buttonSecondaryHover: primitives.accent200,
    buttonSecondaryActive: primitives.accent300,
    buttonSecondarySelectedFill: primitives.accent200,
    buttonSecondarySelectedText: primitives.accent,
    buttonSecondarySpinnerForeground: primitives.accent700,
    buttonSecondarySpinnerBackground: primitives.accent300,

    backgroundPrimary: primitives.mono700,
    backgroundSecondary: primitives.mono700,
    backgroundTertiary: primitives.mono400,
  },
};

const DarkTheme = createDarkTheme(primitives, overrides);

export default DarkTheme;
