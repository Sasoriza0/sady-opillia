/** @type {import('tailwindcss').Config} */
const { transform } = require('next/dist/build/swc');
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-in',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-in',
        'side-slide-out': 'sideSlideOut 0.3s ease-out',
        'side-slide-in': 'sideSlideIn 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-10px)', opacity: '0' },
        },
        sideSlideOut: {
          '0%': { transform: 'translateX(100px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        sideSlideIn: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100px)', opacity: '0' }
        },
      },
      fontFamily: {
        'Roboto': ['Roboto', 'sans-serif']
      },
      fontWeight: {
        '700': '700',
        '900': '900'
      },
      colors: {
        green: '#679436',
        lime: '#A5BE00',
        blue: '#427AA1',
        darkblue: '#05668D',
      },
      container: {
        center: true,
        padding: '15px',
      },
      minHeight: {
        'full': '100%', 
      },
      rotate: {
        '0': '0deg',
        '180': '180deg',
      },
      backgroundColor: {
        'white': '#ffffff',
        'green': '#679436',
        'transparent': 'transparent',
        'none': 'none',
      },
      flexDirection: {
        'column': 'column',
      },
      flex: {
        '0 0 auto': '0 0 33.333%',
      },
      display: {
        'flex': 'flex',
      },
      boxShadow: {
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'lg': '0.5rem',
        'xl': '1rem',
      },
      transitionTimingFunction: {
        'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
      scale: {
        '102': '1.02',
      },
      mixBlendMode: {
        'multiply': 'multiply'
      },
      textTransform: {
        'uppercase': 'uppercase'
      },
      textAlign: {
        'cenet': 'center'
      },
      spacing: {
        '128': '32rem',
        '100': '26rem',
        '200': '60rem'
      },
      scale: {
        '150': '1.5',
      },
      transitionTimingFunction: {
        'ease-custom': 'ease',
      },
      transitionDuration: {
        '300': '300ms',
      },
      cursor: {
        'zoom-in': 'zoom-in',
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents, addBase }) {
      addComponents({
        '.wrapper': {
          'display': 'flex',
          'flex-direction': 'column',
          'overflow': 'clip',
          'min-height': '100%',
          'position': 'relative', 
        },
        '.dropdown-arrow': {
          transition: 'transform 0.3s ease',
        },
        '.type-item': {
          height: '200px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          columnGap: '10px',
          boxShadow: '0px 10px 10px #679436',
          transition: '300ms',
          '&:hover': {
            scale: '1.1',
            boxShadow: '0px 10px 50px #679436',
          },
        },
        '.type-item-text': {
          textAlign: 'center',
          backgroundColor: '#D3D3D3',
          textTransform: 'uppercase',
          padding: '10px',
          borderRadius: '5px',
          fontWeight: '700',
          maxWidth: '200px',
          '&:hover': {
            color: '#679436'
          },
        },
        '.goods': {
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          columnGap: '10px',
          boxShadow: '0px 10px 10px #679436',
          transition: '300ms',
          '&:hover': {
            scale: '1.05',
            boxShadow: '0px 10px 30px #679436',
          },
        },
        '.product-box': {
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          columnGap: '10px',
          boxShadow: '0px 10px 10px #679436',
        },
        '.form-box': {
          display: 'flex',
          flexDirection: 'column'
        },
        '.form-group': {
          display: 'flex'
        },
      }),
      addBase({
        'a': {
          position: 'relative',
          textDecoration: 'none',
          color: 'inherit',
          '&::after': {
            content: '""',
            position: 'absolute',
            left: '0',
            bottom: '-2px',
            width: '0',
            height: '1px',
            backgroundColor: '#facc15',
            transition: 'width 0.3s ease',
            zIndex: '10',
          },
          '&:hover': {
            color: '#facc15',
          },
          '&:hover::after': {
            width: '100%',
          }
        },
        '.no-link-style': {
          position: 'static',
          color: 'inherit',
          '&::after': {
            content: 'none',
          },
          '&:hover': {
            color: 'inherit',
          }
        },
      });     
    })
  ],
};
