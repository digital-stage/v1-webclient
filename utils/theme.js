export default {
  colors: {
    text: 'hsl(212, 100%, 5%)',
    background: '#fff',
    primary: 'hsl(173, 70%, 35%)',
    secondary: 'hsl(315, 97%, 26%)',
    tertiary: 'hsl(211, 39%, 31%)', // cambridge blue
    muted: 'hsl(211, 16%, 68%)',
    accent: 'hsl(45, 100%, 50%)',
    danger: 'hsl(276, 65%, 85%)',
    navigation: 'hsl(333, 50%, 8%)',
    dsbackground:
      'transparent linear-gradient(221deg, #F20544 0%, #F00544 2%, #F20544 2%, #F20544 10%, #721542 50%, #012340 100%) 0% 0% no-repeat padding-box;',
    error: {
      placeholder: 'hsl(333, 95%, 25%)',
      background: 'hsl(333, 50%, 89%)',
    },
    gray: [
      'hsl(173, 5%, 15%)',
      'hsl(173, 5%, 35%)',
      'hsl(173, 5%, 55%)',
      'hsl(173, 5%, 75%)',
      'hsl(173, 5%, 85%)',
      'hsl(173, 5%, 95%)',
    ],
    modes: {
      dark: {
        text: '#fff',
        background: '#1c1c1c',
        primary: '#F52887',
        secondary: '#4EE2EC',
        muted: 'lightgray',
        accent: 'secondary',
        danger: '#d13b40',
        gray: [
          'whitesmoke',
          'gainsboro',
          'lightgray',
          'silver',
          'darkgray',
          'gray',
        ],
      },
    },
  },
  fonts: {
    body: 'Rubik, Verdana, sans-serif',
    heading: 'Inter, Verdana, sans-serif',
    monospace: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    // SANSERATA
  },
  fontWeights: {
    body: 300,
    heading: 700,
    bold: 600,
  },
  lineHeight: {
    body: '1.5',
    heading: '1.125',
  },
  fontSizes: [14, 16, 18, 20, 24, 32, 48, 64, 72, 96],
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  breakpoints: [600, 900, 1200, 1500].map((n) => `${n}px`),
  radii: {},
  sizes: {
    container: {
      fullscreen: '100%',
      largeplus: 'calc(920px + 20vw)',
      smallplus: 'calc(640px + 10vw)',

      wide: '1407px',
      default: '800px',
      small: '400px',
    },
    page: {
      default: '1280px',
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
  styles: {
    root: {
      fontFamily: 'body',
      // lineHeight: 'body',
      fontWeight: 'body',
      fontSize: 2,
      'h1,h2,h3': {
        fontFamily: 'heading',
        // lineHeight: 'heading',
        fontWeight: 'heading',
        color: 'tertiary',
      },
      h1: {
        // fontSize: `2.125rem`,
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
};
