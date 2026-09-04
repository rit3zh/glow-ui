import React, { ComponentType, PropsWithChildren } from "react";

const composeProviders = <T extends ComponentType<PropsWithChildren>[]>(
  ...providers: T
): ComponentType<PropsWithChildren> => {
  return providers.reduce(
    (Accumulated, Current) =>
      ({ children }) => (
        <Accumulated>
          <Current>{children}</Current>
        </Accumulated>
      ),
    ({ children }) => <>{children}</>,
  );
};

export { composeProviders };
