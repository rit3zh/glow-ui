import { createContext, useContext } from "react";

import type { ICouponContext, TCouponComponents } from "./types";

const CouponContext = createContext<ICouponContext | null>(null);

const useCoupon = (
  component: TCouponComponents = "Coupon.Section",
): ICouponContext => {
  const ctx = useContext<ICouponContext | null>(CouponContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <Coupon>.`);
  }
  return ctx;
};

export { CouponContext, useCoupon };
