import type { MotionAnimationConfig } from "../types";
import { useLayoutAnimation } from "../hooks/useLayoutAnimation";

interface MotionProps {
  layoutId: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  as?: React.ElementType;
  config?: MotionAnimationConfig;
}

export function Motion({ layoutId, children, style, as: Component = "div", config, ...props }: MotionProps): React.ReactNode {
  const ref = useLayoutAnimation<HTMLDivElement>(layoutId, config);

  return (
    <Component ref={ref} style={style} {...props}>
      {children}
    </Component>
  );
}
