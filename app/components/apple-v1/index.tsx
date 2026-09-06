import React, { Fragment } from "react";

import AppleV1 from "@/components/blocks/bottom-sheet/apple-v1";
import { StatusBar } from "expo-status-bar";

export default function AppleV1Screen() {
  return (
    <Fragment>
      <StatusBar hidden />
      <AppleV1 />
    </Fragment>
  );
}
