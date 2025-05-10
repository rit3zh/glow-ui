import * as React from 'react';

import { SeekBarIOSReactNativeViewProps } from './SeekBarIOSReactNative.types';

export default function SeekBarIOSReactNativeView(props: SeekBarIOSReactNativeViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
