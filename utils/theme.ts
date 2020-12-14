import { Theme } from '@theme-ui/css';

const theme: Theme = {
  colors: {
    text: '#f4f4f4',
    background: '#1c1c1c',
    primary: '#5779d9',
    primary1: '#6F92F8',
    primaryHover: '#415ca7',
    primaryFocus: '3737F7',
    secondary: '#f20544',
    tertiary: '#808080',
    muted: 'hsl(210,16%,68%)',
    accent: 'hsl(45, 100%, 50%)',
    danger: '#FA000099',
    dangerBg: '#9D131366',
    dangerUnderline: '#A41318',
    success: '#41BD64',
    navigation: 'hsl(333, 50%, 8%)',
    modalBg: '#1c1c1c',
    backdropBg: '#000000B2',
    online: '#00FF3C',
    transparentGray: '#b3b3b39e',
    textfield: '#292929',
    textfieldDark: '#12121226',
    label: '#9A9A9A',
    labelDark: '#29292999',
    gray: ['#D1D1D1', '#B3B3B3', '#828282', '#535353', '#282828', '#181818', '#101010', '#000000'],
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
  fontSizes: [14, 16, 18, 20, 24, 32, 48, 64, 72, 96],
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
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
    default: '0px 23px 17px #00000052',
  },
  text: {
    default: {
      color: 'text',
      fontSize: 1,
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
      mt: 2,
    },
  },
  buttons: {
    primary: {
      fontFamily: 'heading',
      fontSize: 0,
      px: 3,
      py: 0,
      m: 1,
      border: '2px solid primary',
      borderRadius: 'button',
      color: 'text',
      bg: 'primary',
      width: 'auto',
      height: '32px',
      boxShadow: '3px 3px 8px #00000026',
      ':hover': {
        bg: 'primaryHover',
      },
      ':active': {
        bg: '#6f92f8',
      },
      ':focus': {
        border: '1px solid #3737F7',
        outline: 0,
      },
      ':disabled': {
        bg: '#5779D980',
        boxShadow: 'none',
      },
    },
    secondary: {
      variant: 'buttons.primary',
      border: '2px solid #5779d9',
      bg: 'transparent',
      ':hover': {
        borderColor: 'primaryHover',
        bg: '#1212124D',
      },
      ':active': {
        bg: '#5779d94D',
        borderColor: '#6f92f8',
      },
      ':focus': {
        borderColor: '#3737F7',
        outline: 0,
      },
      ':disabled': {
        bg: '#5779D980',
        boxShadow: 'none',
      },
    },
    tertiary: {
      variant: 'buttons.primary',
      border: '2px solid #808080',
      bg: 'transparent',
      ':hover': {
        borderColor: '#676767',
        bg: '#1212124D',
      },
      ':active': {
        bg: '#5779d94D',
        borderColor: '#5779d9',
      },
      ':focus': {
        borderColor: '#3737F7',
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
        bg: '#b50030',
      },
      ':active': {
        bg: '#fa406b',
      },
      ':focus': {
        borderColor: '#3737F7',
        outline: 0,
      },
      ':disabled': {
        borderColor: '#f20544',
        boxShadow: 'none',
        opacity: '0.5',
      },
    },
    icon: {
      color: 'primary',
      borderRadius: '50%',
      p: 2,
      ':hover': {
        color: 'primaryHover',
        bg: 'gray.5',
      },
      ':active': {
        color: '#6f92f8',
        bg: 'gray.5',
      },
      ':focus': {
        border: '1px solid #3737F7',
        outline: 0,
      },
      ':disabled': {
        bg: '#5779D980',
        boxShadow: 'none',
      },
    },
    tertiaryIcon: {
      variant: 'buttons.tertiary',
      border: 0,
      borderRadius: '50%',
      color: '#808080',
      p: 2,
      ':hover': {
        bg: '#121212',
      },
      ':active': {
        bg: '#5779d94D',
        border: '1px solid #5779d9',
      },
      ':focus': {
        border: '1px solid #3737F7',
        outline: 0,
      },
      ':disabled': {
        border: '1px solid #80808080',
        boxShadow: 'none',
      },
    },
    close: {
      color: 'gray.1',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      ':hover': {
        bg: 'gray.2',
        color: 'gray.3',
      },
      ':focus': {
        border: '1px solid #3737F7',
        bg: 'transparent',
        outline: 0,
      },
    },
    function: {
      variant: 'buttons.primary',
      width: '48px',
      height: '48px',
      bg: 'primary',
      color: 'text',
      m: 0,
      p: 0,
      borderRadius: '50%',
      ':hover': {
        bg: '#4561b1',
      },
      ':active': {
        bg: '#6f92f8',
      },
      ':focus': {
        border: '1px solid #3737F7',
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
        bg: '#b50030',
      },
      ':active': {
        bg: '#fa406b',
      },
      ':focus': {
        border: '1px solid #3737F7',
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
        borderColor: '#676767',
        bg: 'gray.3',
      },
      ':active': {
        bg: '#5779d94D',
        borderColor: '#5779d9',
      },
      ':focus': {
        border: '1px solid #3737F7',
        outline: 0,
      },
      ':disabled': {
        boxShadow: 'none',
        opacity: '0.5',
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
      height: 'auto',
      py: 1,
      px: 3,
      ':hover': {
        bg: '#b7b7b7',
      },
      ':active': {
        bg: '#bec6dc',
      },
      ':focus': {
        bg: 'text',
        border: '1px solid #3737F7',
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
        border: '1px solid #3737F7',
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
      fontSize: 3,
      my: 2,
      py: 3,
      px: 3,
      color: 'text',
      textDecoration: 'none',
      borderBottom: '2px solid transparent',
      transition: 'border 1s ease-out',
      ':active,:visited': { color: 'text' },
      ':hover': {
        borderBottomColor: 'secondary',
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
};
export default theme;
