import { useRole } from "./roleStore";
import { fmtCurrency } from "./mockData";

/**
 * Role-based data masking for sensitive financial figures.
 * Only CFO and Controller see real amounts; everyone else sees "•••••".
 */
export const useMask = () => {
  const { user } = useRole();
  const canSee = user.role === "CFO" || user.role === "Controller";
  const maskCurrency = (value: number) => (canSee ? fmtCurrency(value) : "••••••");
  const maskNumber = (value: number) => (canSee ? value.toLocaleString() : "•••");
  return { canSee, maskCurrency, maskNumber, masked: !canSee };
};
