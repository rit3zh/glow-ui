export {};

declare global {
  interface RegisterComponentInitialProps {
    exp?: {
      notification?: any;
      manifestString?: string;
      [key: string]: any;
    };
    shell?: boolean;
    shellManifestUrl?: string;
    [key: string]: any;
  }
}
