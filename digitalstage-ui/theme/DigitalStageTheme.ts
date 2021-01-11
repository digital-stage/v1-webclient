import { Theme } from '@theme-ui/css';

const DigitalStageTheme: Theme = {
  colors: {
    text: '#f4f4f4',
    background: '#121212',
    backgroundTransparent: '#1212124D',
    primary: '#5779D9',
    primaryActive: '#6F92F8',
    primaryHover: '#415CA7',
    primaryFocus: '#3737F7',
    primaryDisabled: '#5779D980',
    primaryTransparent: '#5779d94D',
    secondary: '#F20544',
    secondaryHover: '#b50030',
    secondaryActive: '#fa406b',
    tertiary: '#808080',
    muted: 'hsl(210,16%,68%)',
    accent: 'hsl(45, 100%, 50%)',
    danger: '#FA000099',
    dangerBg: '#9D131366',
    dangerUnderline: '#A41318',
    success: '#41BD64',
    navigation: 'hsl(333, 50%, 8%)',
    modalBg: '#00000080',
    backdropBg: '#000000B2',
    online: '#00FF3C',
    transparentGray: '#b3b3b39e',
    textfield: '#292929',
    textfieldDark: '#12121226',
    label: '#9A9A9A',
    labelDark: '#29292999',
    gray: ['#F4F4F4', '#9A9A9A', '#808080', '#676767', '#393939', '#292929', '#1F1F1F', '#121212'],
  },
  fonts: {
    body: "'Open Sans', Verdana, sans-serif",
    heading: 'Poppins, Verdana, sans-serif',
    monospace: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    // SANSERATA
  },
  fontWeights: {
    body: 300,
    heading: 600,
    bold: 600,
  },
  lineHeights: {
    body: '1.5',
    heading: '1.125',
  },
  fontSizes: [12, 14, 18, 24, 32, 40],
  space: [0, 2, 4, 8, 12, 16, 24, 32, 48, 64],
  breakpoints: [600, 900, 1200, 1500].map((n) => `${n}px`),
  radii: {
    card: '18px',
    button: '21px',
    round: '50%',
  },
  sizes: {
    container: {
      fullscreen: '100%',
      wide: '1407px',
      default: '800px',
      stage: '600px',
      small: '400px',
      tiny: '332px',
    },
    page: {
      default: '1280px',
    },
    group: {
      width: '30px',
      height: '30px',
    },
  },
  shadows: {
    default: '0px 16px 20px #00000040',
    button: '3px 3px 8px #00000026',
  },
  text: {
    default: {
      color: 'text',
      fontSize: 1,
      fontWeight: 'heading',
      fontFamily: 'body',
    },
    hint: {
      fontSize: 0,
      color: 'gray.1',
    },
    caps: {
      textTransform: 'uppercase',
      letterSpacing: '0.2em',
    },
    heading: {
      color: 'text',
    },
    title: {
      color: 'background',
    },
    subTitle: {
      color: 'background',
      fontSize: 0,
      fontWeight: 'heading',
      fontFamily: 'body',
      mt: 2,
    },
    h2: {
      fontSize: 4,
      fontFamily: 'heading',
      fontWeight: 'heading',
    },
    h4: {
      fontSize: 2,
      fontFamily: 'heading',
      fontWeight: 'heading',
    },
    h5: {
      fontSize: 1,
      fontFamily: 'heading',
      fontWeight: 'heading',
    },
    h6: {
      fontSize: 1,
      fontFamily: 'body',
      fontWeight: 'heading',
    },
    body: {
      fontSize: 1,
      fontFamily: 'body',
      fontWeight: 'body',
    },
    bodySmall: {
      fontSize: 0,
      fontFamily: 'body',
      fontWeight: 'heading',
    },
    micro: {
      fontSize: 0,
      fontFamily: 'body',
      fontWeight: 'heading',
    },
    tab: {
      variant: 'text.h4',
      borderBottom: '1px solid transparent',
      color: 'gray.1',
      ':hover': {
        borderColor: 'primaryHover',
        color: 'primaryHover',
      },
      ':active': {
        borderColor: 'primary',
        color: 'primary',
      },
      ':focus': {
        borderColor: 'primaryFocus',
        color: 'text',
      },
    },
  },
  /* Buttons */
  buttons: {
    primary: {
      fontFamily: 'heading',
      fontSize: 1,
      px: 4,
      py: 0,
      m: 3,
      border: '1px solid transparent',
      borderRadius: 'button',
      color: 'text',
      bg: 'primary',
      width: 'auto',
      height: '32px',
      boxShadow: 'button',
      ':hover': {
        bg: 'primaryHover',
        cursor: 'pointer',
      },
      ':active': {
        bg: 'primaryActive',
      },
      ':focus': {
        borderColor: 'primaryFocus',
        outline: 0,
      },
      ':disabled': {
        bg: 'primaryDisabled',
        boxShadow: 'none',
      },
    },
    secondary: {
      variant: 'buttons.primary',
      border: '2px solid transparent',
      borderColor: 'primary',
      bg: 'transparent',
      ':hover': {
        borderColor: 'primaryHover',
        bg: '#1212124D',
        cursor: 'pointer',
      },
      ':active': {
        bg: 'primaryTransparent',
        borderColor: 'primaryActive',
      },
      ':focus': {
        borderColor: 'primaryFocus',
        outline: 0,
      },
      ':disabled': {
        bg: 'primaryDisabled',
        boxShadow: 'none',
      },
    },
    tertiary: {
      color: 'background',
      variant: 'buttons.primary',
      border: '2px solid transparent',
      borderColor: 'tertiary',
      bg: 'transparent',
      ':hover': {
        borderColor: 'gray.3',
        bg: 'backgroundTransparent',
        cursor: 'pointer',
      },
      ':active': {
        bg: 'primaryTransparent',
        borderColor: 'primary',
      },
      ':focus': {
        borderColor: 'primaryFocus',
        outline: 0,
      },
      ':disabled': {
        borderColor: '#80808080',
        boxShadow: 'none',
      },
    },
    danger: {
      variant: 'buttons.primary',
      border: '2px solid primary',
      bg: 'secondary',
      ':hover': {
        bg: 'secondaryHover',
        cursor: 'pointer',
      },
      ':active': {
        bg: 'secondaryActive',
      },
      ':focus': {
        borderColor: 'primaryFocus',
        outline: 0,
      },
      ':disabled': {
        borderColor: 'secondary',
        boxShadow: 'none',
        opacity: '0.5',
      },
    },
    /* FLOATING BUTTON - Icon single function */
    icon: {
      color: 'primary',
      borderRadius: '50%',
      border: '1px solid transparent',
      p: 3,
      ':hover': {
        color: 'primaryHover',
        bg: 'gray.5',
        cursor: 'pointer',
      },
      ':active': {
        color: 'primaryActive',
        bg: 'gray.5',
      },
      ':focus': {
        borderColor: 'primaryFocus',
        outline: 0,
      },
      ':disabled': {
        bg: 'primaryDisabled',
        boxShadow: 'none',
      },
    },
    iconTertiary: {
      variant: 'buttons.tertiary',
      border: '1px solid transparent',
      borderColor: 'transparent',
      borderRadius: '50%',
      color: 'tertiary',
      p: 3,
      ':hover': {
        bg: 'gray.5',
        cursor: 'pointer',
      },
      ':active': {
        bg: 'primaryTransparent',
        borderColor: 'primary',
      },
      ':focus': {
        borderColor: 'primaryFocus',
        outline: 0,
      },
      ':disabled': {
        border: '1px solid #80808080',
        boxShadow: 'none',
      },
    },
    iconDanger: {
      variant: 'buttons.function',
      bg: 'secondary',
      ':hover': {
        bg: 'secondaryHover',
        cursor: 'pointer',
      },
      ':active': {
        bg: 'secondaryActive',
      },
      ':focus': {
        borderColor: 'primaryFocus',
        outline: 0,
      },
      ':disabled': {
        boxShadow: 'none',
        opacity: '0.5',
      },
    },
    /* FLOATING BUTTON - Icon toggle function */

    function: {
      variant: 'buttons.primary',
      bg: 'tertiary',
      width: '48px',
      height: '48px',
      m: 0,
      p: 0,
      borderRadius: '50%',
      ':hover': {
        bg: 'primaryHover',
        cursor: 'pointer',
      },
      ':active': {
        bg: 'primaryActive',
      },
      ':focus': {
        borderColor: 'primaryFocus',
        outline: 0,
      },
      ':disabled': {
        boxShadow: 'none',
        opacity: '0.5',
      },
    },
    functionToggled: {
      variant: 'buttons.primary',
      width: '48px',
      height: '48px',
      m: 0,
      p: 0,
      borderRadius: '50%',
      ':hover': {
        bg: 'primaryHover',
        cursor: 'pointer',
      },
      ':active': {
        bg: 'primaryActive',
      },
      ':focus': {
        borderColor: 'primaryFocus',
        outline: 0,
      },
      ':disabled': {
        boxShadow: 'none',
        opacity: '0.5',
      },
    },
    functionDanger: {
      variant: 'buttons.function',
      bg: 'secondary',
      ':hover': {
        bg: 'secondaryHover',
        cursor: 'pointer',
      },
      ':active': {
        bg: 'secondaryActive',
      },
      ':focus': {
        borderColor: 'primaryFocus',
        outline: 0,
      },
      ':disabled': {
        boxShadow: 'none',
        opacity: '0.5',
      },
    },
    functionDangerToggled: {
      variant: 'buttons.function',
      bg: 'secondary',
      ':hover': {
        bg: 'secondaryHover',
        cursor: 'pointer',
      },
      ':active': {
        bg: 'secondaryActive',
      },
      ':focus': {
        borderColor: 'primaryFocus',
        outline: 0,
      },
      ':disabled': {
        boxShadow: 'none',
        opacity: '0.5',
      },
    },
    functionTertiary: {
      variant: 'buttons.function',
      bg: 'gray.2',
      ':hover': {
        borderColor: 'gray.3',
        bg: 'gray.3',
        cursor: 'pointer',
      },
      ':active': {
        bg: 'primaryTransparent',
        borderColor: 'primary',
      },
      ':focus': {
        borderColor: 'primaryFocus',
        outline: 0,
      },
      ':disabled': {
        boxShadow: 'none',
        opacity: '0.5',
      },
    },
    functionTertiaryToggled: {
      variant: 'buttons.function',
      bg: 'gray.2',
      ':hover': {
        borderColor: 'gray.3',
        bg: 'gray.3',
        cursor: 'pointer',
      },
      ':active': {
        bg: 'primaryTransparent',
        borderColor: 'primary',
      },
      ':focus': {
        borderColor: 'primaryFocus',
        outline: 0,
      },
      ':disabled': {
        boxShadow: 'none',
        opacity: '0.5',
      },
    },
    /* DEPREACTED? */
    close: {
      color: 'gray.1',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      ':hover': {
        bg: 'gray.2',
        color: 'gray.3',
        cursor: 'pointer',
      },
      ':focus': {
        border: '1px solid transparent',
        borderColor: 'primaryFocus',
        bg: 'transparent',
        outline: 0,
      },
    },
    togglePrimaryOn: {
      variant: 'buttons.primary',
      width: '32px',
      height: '32px',
      color: 'text',
      m: 0,
      p: 0,
    },
    togglePrimaryOf: {
      variant: 'buttons.primary',
      width: '32px',
      height: '32px',
      color: 'text',
      m: 0,
      p: 0,
    },
    white: {
      variant: 'buttons.primary',
      border: '1px solid #f4f4f4',
      borderColor: 'text',
      color: 'background',
      bg: 'text',
      py: 'auto',
      ':hover': {
        bg: '#b7b7b7',
        cursor: 'pointer',
      },
      ':active': {
        bg: '#bec6dc',
      },
      ':focus': {
        bg: 'text',
        borderColor: 'primaryFocus',
        outline: 0,
      },
    },
    outline: {
      variant: 'buttons.primary',
      borderColor: 'text',
      color: 'text',
      bg: 'transparent',
    },
    login: {
      fontFamily: 'heading',
      fontSize: 3,
      bg: 'background',
      color: 'text',
      padding: '10px 20px',
      my: 2,
      py: 3,
      px: 3,
      cursor: 'pointer',
      borderBottom: '2px solid transparent',
      ':hover,:active,:focus': {
        border: 'none',
        transition: 'border 1s ease-out',
        borderBottom: '2px solid transparent',
        borderColor: 'secondary',
      },
    },
    text: {
      border: 'none',
      bg: 'transparent',
      m: 0,
      p: 0,
      cursor: 'pointer',
      ':focus': {
        border: 0,
        outline: 0,
      },
    },
    circle: {
      border: 'none',
      m: 0,
      p: 0,
      bg: 'primary',
      width: '48px',
      height: '48px',
      color: 'text',
      borderRadius: '50%',
      ':focus': {
        outline: 0,
      },
    },
    circleGray: {
      border: 'none',
      m: 0,
      p: 0,
      bg: 'gray.2',
      width: '48px',
      height: '48px',
      color: 'text',
      borderRadius: '32px',
      ':focus': {
        border: '1px solid transparent',
        borderColor: 'primaryFocus',
        outline: 0,
      },
    },
    circleWhite: {
      border: 'none',
      m: 0,
      p: 0,
      bg: 'text',
      width: '48px',
      height: '48px',
      color: 'background',
      borderRadius: '32px',
    },
    circleOutlined: {
      border: '1px solid white',
      m: 0,
      p: 0,
      bg: 'transparent',
      width: '48px',
      height: '48px',
      color: 'text',
      borderRadius: '32px',
    },
  },
  links: {
    auth: {
      fontFamily: 'heading',
      fontSize: 2,
      mb: 5,
      mx: 1,
      py: 3,
      px: 3,
      color: 'text',
      textDecoration: 'none',
      borderBottom: '2px solid transparent',
      transition: 'border 1s ease-out',
      ':active,:visited': { color: 'text' },
      ':hover': {
        borderBottomColor: 'secondary',
        cursor: 'pointer',
      },
    },
  },
  cards: {
    primary: {
      padding: 2,
      borderRadius: 4,
      boxShadow: '0 0 8px rgba(0, 0, 0, 0.125)',
    },
    compact: {
      padding: 1,
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'muted',
    },
  },
  messages: {
    info: {
      mt: 4,
      borderRadius: 0,
      bg: 'text',
      color: 'background',
    },
    success: {
      variant: 'messages.info',
      borderLeftColor: 'success',
      bg: 'success',
      color: 'text',
    },
    warning: {
      variant: 'messages.info',
      borderLeftColor: 'accent',
      bg: 'accent',
      color: 'background',
    },
    danger: {
      variant: 'messages.info',
      borderLeftColor: '#A61010',
      bg: '#A61010',
      color: 'text',
    },
  },
  styles: {
    root: {
      fontFamily: 'body',
      fontWeight: 'body',
      fontSize: 1,
      'h1,h2,h3': {
        fontFamily: 'heading',
        fontWeight: 'heading',
        color: 'gray.0',
      },
      h1: {
        fontSize: 5,
        hyphens: ['auto', 'manual'],
      },
      'h2,h3': {
        hyphens: ['auto', 'manual'],
        marginTop: '2.58rem',
        marginBottom: '1.00781rem',
      },
      'summary,.tldr': {
        fontFamily: 'heading',
        fontSize: '1.25rem',
        fontWeight: 200,
        color: '#002856',
        lineHeight: '1.5rem',
        hyphens: 'auto',
        marginBottom: '1.00781rem',
        '&.landing': {
          fontSize: '1.75rem',
          lineHeight: '2rem',
          color: 'background',
        },
      },
      p: {
        mb: '1rem',
      },
      strong: {
        color: 'primary',
      },
      blockquote: {
        fontFamily: 'heading',
        fontSize: '1.25rem',
        // fontStyle: 'italic',
        color: 'secondary',
        borderLeft: '0.25rem solid',
        borderColor: 'secondary',
        my: [4, 5],
        mx: [0, null, '-32px', '-64px'],
        py: '0.75rem',
        pr: ['0.75rem', null, 0],
        pl: ['0.75rem', null, 'calc(32px - 0.25rem)', 'calc(64px - 0.25rem)'],
        '& strong': {
          color: 'secondary',
        },
        '& p': {
          mb: 0,
        },
      },
      'blockquote > :last-child': {
        mb: 0,
      },
      'code,kbd,pre,samp': {
        fontFamily: 'monospace',
        lineHeight: '1.6125',
      },
      ul: {
        listStyleType: 'square',
      },
      '.gatsby-resp-image-image': {
        bg: 'primary',
        borderRadius: 4,
      },
      '.iAmIlH': {
        fontSize: '0px',
        lineHeight: 0,
        visibility: 'hidden',
        display: 'none',
      },
    },
    code: {
      // ...prismTheme,
      fontSize: '0.75rem',
    },
    navlink: {
      mb: [0, null, 2],
      // pb: [`3px`, null, 0],
      px: [2, null, 3],
      fontFamily: 'heading',
      fontWeight: 600,
      textDecoration: 'none',
      color: 'navigation',
      borderBottom: 'unset',
      border: '2px solid',
      borderColor: 'background',
      boxShadow: 'unset',
      transition: '1s ease-in all',
      ':hover': {
        boxShadow: 'unset',
        borderBottom: 'unset',
        border: '2px solid',
        borderColor: 'background',
        color: 'primary',
        transition: '1s ease-in all',
        cursor: 'pointer',
      },
      ':active, &.active': {
        color: ['navigation', null, 'navigation'],
        fontWeight: [600, null, 400],
        bg: ['transparent', null, 'transparent'],
        border: '2px solid',
        borderColor: ['background', null, 'navigation'],
        borderRadius: '4px',
        transition: '1s ease-in all',
        boxShadow: 'unset',
      },
    },
    pre: {
      // fontSize: `0.75rem`,
      '&.prism-code': {
        p: [2, 3],
      },
      '&.language-sh > div': {
        ':before': {
          content: '"$ "',
        },
      },
      '&.highlight': {
        background: 'hsla(0, 0%, 30%, .5)',
      },
    },
  },
  images: {
    avatar: {
      width: 30,
      height: 30,
      borderRadius: '50%',
      maxWidth: 30,
      minWidth: 30,
      mr: 3,
    },
  },
  forms: {
    checkbox: {
      color: 'gray.5',
    },
    select: {
      fontFamily: 'body',
      fontWeight: 'body',
      fontSize: 1,
      height: '64px',
      my: 5,
      p: 5,
      bg: 'gray.5',
      border: 0,
      borderBottom: '1px solid transparent',
      borderColor: 'text',
      borderRadius: 0,
      ':hover': {
        borderColor: 'primaryHover',
        bg: 'gray.6',
      },
      ':focus': {
        borderWidth: '3px',
        borderColor: 'primaryFocus',
        outline: 0,
      },
      'option:checked': {
        color: 'primary',
      },
      ':disabled': {
        bg: 'textfieldDark',
        color: '#f4f4f44D',
        borderColour: '#f4f4f44D',
      },
    },
  },
};
export default DigitalStageTheme;
