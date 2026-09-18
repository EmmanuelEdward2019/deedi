"use client";

import { useState } from "react";
import { Trash } from "@/components/icons";
import { cx } from "@/components/ui";

/**
 * Two-step delete: the first click arms the button, the second submits the
 * enclosing form. Prevents an accidental click destroying a listing.
 */
export function DeleteButton({
  label = "Delete",
  confirmLabel = "Confirm?",
  compact,
}: {
  label?: string;
  confirmLabel?: string;
  compact?: boolean;
}) {
  const [armed, setArmed] = useState(false);

  return (
    <button
      type={armed ? "submit" : "button"}
      onClick={(event) => {
        if (!armed) {
          event.preventDefault();
          setArmed(true);
          setTimeout(() => setArmed(false), 4000);
        }
      }}
      className={cx(
        "inline-flex items-center gap-1.5 border font-semibold transition-colors",
        compact ? "px-2.5 py-1.5 text-xs" : "px-4 py-2.5 text-[0.8125rem]",
        armed
          ? "border-rose-600 bg-rose-600 text-white"
          : "border-rose-200 text-rose-600 hover:bg-rose-50",
      )}
    >
      <Trash className={compact ? "size-3.5" : "size-4"} />
      {armed ? confirmLabel : label}
    </button>
  );
}
