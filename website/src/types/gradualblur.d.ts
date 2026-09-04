// The package only ships types for its root entry; we import the React
// component directly so mathjs is the only extra thing pulled in.
declare module "gradualblur/Gradualblur.jsx" {
  import type { GradualBlurProps } from "gradualblur";
  import type React from "react";

  const GradualBlur: React.FC<GradualBlurProps>;
  export default GradualBlur;
}
