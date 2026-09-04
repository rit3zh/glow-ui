import React, { Fragment } from "react";

import BillingV1 from "@/components/blocks/bottom-sheet/billing-v1";
import { StatusBar } from "expo-status-bar";

export default function BillingV1Screen() {
  return (
    <Fragment>
      <StatusBar hidden />
      <BillingV1 />
    </Fragment>
  );
}
