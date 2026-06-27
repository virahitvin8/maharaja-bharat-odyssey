import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.akshit.maharaja.bharat.odyssey',
  appName: "Maharaja's Bharat Odyssey",
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: true,
  },
  plugins: {
    Keyboard: {
      resizeOnFullScreen: true,
    },
  },
}

export default config
