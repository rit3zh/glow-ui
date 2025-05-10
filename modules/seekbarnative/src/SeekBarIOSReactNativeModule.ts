import { NativeModule, requireNativeModule } from 'expo';

import { SeekBarIOSReactNativeModuleEvents } from './SeekBarIOSReactNative.types';

declare class SeekBarIOSReactNativeModule extends NativeModule<SeekBarIOSReactNativeModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<SeekBarIOSReactNativeModule>('SeekBarIOSReactNative');
