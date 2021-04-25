import { Global, css } from '@emotion/react';
import React from 'react';

import bold from './NOTOSANSKR-BOLD.OTF';
import light from './NOTOSANSKR-LIGHT.OTF';

const GlobalCSS = css`
  @font-face {
    font-family: 'opentalk-light';
    src: url(${light}) format('truetype');
    font-weight: 300;
    font-style: normal;
  }
  @font-face {
    font-family: 'opentalk-bold';
    src: url(${bold}) format('truetype');
    font-weight: 700;
    font-style: normal;
  }

  body {
    margin: 0;
    font-family: 'opentalk-light', -apple-system, 'opentalk-bold', BlinkMacSystemFont, 'Segoe UI',
      'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow: hidden;
  }
`;

const GlobalStyle = () => <Global styles={GlobalCSS} />;

export default GlobalStyle;