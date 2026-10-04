"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

export const PLANNER_REFRESH_EVENT = "planner:refresh-actuals";
export const PLANNER_REFRESH_STATUS_EVENT = "planner:refresh-status";

/**
 * Icon-only refresh trigger shown on the active Planner workbook tab, right
 * next to the freeze (lock) toggle. It dispatches a window event that the
 * PlannerSheet listens to, mirroring TabFreezeToggle's span pattern so it can
 * live inside the parent tab <button> without invalid nesting.
 */
export default function PlannerTabRefresh() {
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const handleStatus = (event: Event) => {
      const detail = (event as CustomEvent<{ refreshing?: boolean }>).detail;
      setRefreshing(detail?.refreshing === true);
    };
    window.addEventListener(PLANNER_REFRESH_STATUS_EVENT, handleStatus);
    return () =>
      window.removeEventListener(PLANNER_REFRESH_STATUS_EVENT, handleStatus);
  }, []);

  function trigger(
    event:
      | React.MouseEvent<HTMLSpanElement>
      | React.KeyboardEvent<HTMLSpanElement>,
  ) {
    event.preventDefault();
    event.stopPropagation();
    if (refreshing) return;
    window.dispatchEvent(new CustomEvent(PLANNER_REFRESH_EVENT));
  }

  return (
    <span
      role="button"
      tabIndex={0}
      aria-label="Refresh planner actuals from the Consolidated View"
      title="Refresh Actual columns from the market and the Consolidated View"
      aria-busy={refreshing}
      onClick={trigger}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") trigger(event);
      }}
      className="inline-flex h-[14px] w-[14px] items-center justify-center rounded text-emerald-900/75 transition-colors hover:text-emerald-700 cursor-pointer"
    >
      <RefreshCw size={11} aria-hidden="true" className={refreshing ? "animate-spin" : ""} />
    </span>
  );
}
