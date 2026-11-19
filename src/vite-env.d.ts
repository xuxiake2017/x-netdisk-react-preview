/// <reference types="vite/client" />

export {}

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: () => unknown
  }
}
