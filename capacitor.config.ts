import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.clausewala.app',
  appName: 'ClauseWala',
  webDir: 'public',
  server: {
    url: 'https://clausewala.in',
    cleartext: true
  }
};

export default config;
