import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c9aa635900904bffb4e9a5858e59703b',
  appName: 'Terex',
  webDir: 'dist',
  server: {
    url: 'https://c9aa6359-0090-4bff-b4e9-a5858e59703b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'always'
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
