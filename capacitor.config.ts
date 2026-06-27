import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.akshit.maharaja.bharat.odyssey',
  appName: "Maharaja's Bharat Odyssey",
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'https://virahitvin8.github.io/maharaja-bharat-odyssey/',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
    },
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },
  plugins: {
    Keyboard: {
      resizeOnFullScreen: true,
    },
  },
}

export default config
