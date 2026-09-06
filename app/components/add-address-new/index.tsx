import React, { Fragment } from "react";

import AddAddressNew from "@/components/blocks/bottom-sheet/add-address-new";
import { StatusBar } from "expo-status-bar";

export default function AddAddressNewScreen() {
  return (
    <Fragment>
      <StatusBar hidden />
      <AddAddressNew />
    </Fragment>
  );
}
