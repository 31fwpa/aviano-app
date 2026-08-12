import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'mil.af.aviano',
  appName: 'Aviano Air Base',
  webDir: 'dist/client',
  plugins: {
    SplashScreen: {
      // The app dismisses the splash itself, once the first screen has
      // actually painted (see hideSplashWhenReady in src/lib/native.ts).
      // Auto-hide would drop it the moment the webview exists, which leaves a
      // blank flash while the app boots.
      launchAutoHide: false,
      backgroundColor: '#0b1f3a',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_INSIDE',
      showSpinner: false,
    },
  },
};

export default config;
