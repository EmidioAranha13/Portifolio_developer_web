import { forwardRef } from "react";
import type { CardBoxProps } from "../../utils/Types";
import "./CardBox.css";

/**
 * Container reutilizável de cartão com efeito de vidro.
 */
const CardBox = forwardRef<HTMLDivElement, CardBoxProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={`card-box glass-surface${className ? ` ${className}` : ""}`}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

CardBox.displayName = "CardBox";

export default CardBox;
