// give the Cognito SDK what it expects
import { Buffer } from 'buffer';

declare global {
  interface Window {
    global: any;
    Buffer: any;
  }
}

window.global = window;
window.Buffer = Buffer;
