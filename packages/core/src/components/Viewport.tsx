import { useId, useRef } from "react";

interface ViewportProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
}

export function Viewport({
  children,
  className,
  style,
  as: Component = "div",
}: ViewportProps) {
  const viewportId = useId();
  const elementRef = useRef<HTMLElement>(null);

  return (
    <Component data-viewport-id={viewportId} ref={elementRef} className={className} style={style}>
      {children}
    </Component>
  );
}
