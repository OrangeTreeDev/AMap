/// <reference types="react-scripts" />

declare module 'classnames';

declare module 'rmc-feedback';

declare namespace global {
  interface window {
    AMap: any;
  }
}