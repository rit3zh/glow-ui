import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './SeekBarIOSReactNative.types';

type SeekBarIOSReactNativeModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class SeekBarIOSReactNativeModule extends NativeModule<SeekBarIOSReactNativeModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(SeekBarIOSReactNativeModule);
