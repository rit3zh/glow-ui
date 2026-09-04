import type { SVGProps } from "react";

import { LOGO_PATHS, LOGO_VIEWBOX } from "./paths";

export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox={LOGO_VIEWBOX}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    {LOGO_PATHS.map((d) => (
      <path d={d} fill="currentColor" key={d} />
    ))}
  </svg>
);
