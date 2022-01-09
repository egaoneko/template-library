import {CSSProp} from 'styled-components';

import {Theme} from './constants/theme';

declare module 'react' {
  interface Attributes {
    css?: CSSProp;
  }
}

// import original module declarations

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
