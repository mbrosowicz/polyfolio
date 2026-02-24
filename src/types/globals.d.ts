// Extend window object for custom properties
declare global {
  interface Window {
    __DEBUG__?: boolean;
  }
}

export {};
