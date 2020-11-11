import React from "react";
import {useErrors} from "../lib/useErrors";

const ErrorHandler = (
  props: {
    children: React.ReactNode
  }
) => {
  const {children} = props;
  const {errors, warnings} = useErrors();

  if (errors.length > 0) {
    errors.forEach(error => console.error(error));
    return (
      <div>
        SERVICE NOT AVAILABLE
        {errors.map(error => error.message)}
      </div>
    )
  }

  if (warnings.length > 0) {
    warnings.forEach(warning => console.warn(warning));
    return (
      <>
        {children}
        {warnings.length > 0 ? (
          <div>
            WARNING:
            <p>
              {warnings.map(warning => warning.message)}
            </p>
          </div>
        ) : undefined}
      </>
    )
  }

  return (
    <>
      {children}
    </>
  );
}
export default ErrorHandler;
