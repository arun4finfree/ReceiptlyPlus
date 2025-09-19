/**
 * Capacitor Configuration for ReceiptlyPlus Mobile
 * 
 * This configuration file defines the settings for the Capacitor mobile app,
 * including app metadata, plugins, and platform-specific configurations.
 * 
 * Key Features:
 * - Android platform configuration
 * - App metadata and branding
 * - Plugin configurations
 * - Security settings
 * - Performance optimizations
 * 
 * @author ReceiptlyPlus Development Team
 * @version 1.0.0
 */

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.receiptlyplus.mobile',
  appName: 'ReceiptlyPlus Mobile',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#2563eb",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#ffffff",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#ffffff',
      overlaysWebView: false,
    },
    Filesystem: {
      iosIsDocumentPickerEnabled: true,
      androidIsDocumentPickerEnabled: true,
    },
    Share: {
      title: 'ReceiptlyPlus - Rental Receipt',
      dialogTitle: 'Share Receipt',
    },
    App: {
      launchUrl: 'https://receiptlyplus.com',
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    appendUserAgent: 'ReceiptlyPlus-Mobile/1.0.0',
    overrideUserAgent: 'ReceiptlyPlus-Mobile/1.0.0',
    backgroundColor: '#ffffff',
    initialFocus: false,
    mixedContentMode: 'compatibility',
    useLegacyBridge: false,
    webSecurity: false,
  }
};

export default config;
