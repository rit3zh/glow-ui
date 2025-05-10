import { requireNativeView } from 'expo';
import * as React from 'react';

import { SeekBarIOSReactNativeViewProps } from './SeekBarIOSReactNative.types';

const NativeView: React.ComponentType<SeekBarIOSReactNativeViewProps> =
  requireNativeView('SeekBarIOSReactNative');

export default function SeekBarIOSReactNativeView(props: SeekBarIOSReactNativeViewProps) {
  return <NativeView {...props} />;
}
