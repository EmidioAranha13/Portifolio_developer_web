import { forwardRef } from "react";
import "./CardBox.css";

type CardBoxProps = React.PropsWithChildren<{
  className?: string;
}> &
  React.HTMLAttributes<HTMLDivElement>;

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
