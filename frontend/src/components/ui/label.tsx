"use client";

import * as React from "react";

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={
        "block text-sm font-medium leading-6 text-gray-700 " +
        (className ? className : "")
      }
      {...props}
    />
  )
);

Label.displayName = "Label"; 