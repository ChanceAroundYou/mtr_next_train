export {};

declare global {
  interface Window {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
  
  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<{
      outcome: 'accepted' | 'dismissed';
      platform: string;
    }>;
    userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
      platform: string;
    }>;
  }
}
