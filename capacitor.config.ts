import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.seniorenportal.app',
  appName: 'Senioren Portal',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: {
    backgroundColor: '#f7f4ed'
  }
};

export default config;
