import { createContext, useContext, useId, useRef } from "react";

const ViewportContext = createContext<string | null>(null);

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
    <ViewportContext.Provider value={viewportId}>
      <Component data-viewport-id={viewportId} ref={elementRef} className={className} style={style}>
        {children}
      </Component>
    </ViewportContext.Provider>
  );
}

export function useViewportId() {
  const viewportId = useContext(ViewportContext);
  return viewportId ?? "root";
}
