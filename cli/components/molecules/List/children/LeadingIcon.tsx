import { Text } from "react-native";
import * as React from "react";

interface LeadingIconProps {
  children: React.ReactNode;
}
export const LeadingIcon: React.FC<LeadingIconProps> &
  React.FunctionComponent<LeadingIconProps> = ({
  children,
}): React.ReactNode & React.JSX.Element => {
  return <React.Fragment>{children}</React.Fragment>;
};
