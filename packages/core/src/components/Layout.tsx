import type { LayoutAnimationConfig } from "../types";
import { useLayoutAnimation } from "../hooks/useLayoutAnimation";

interface LayoutProps {
  layoutId: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  as?: React.ElementType;
  config?: LayoutAnimationConfig;
}

export function Layout({ layoutId, children, style, as: Component = "div", config, ...props }: LayoutProps): React.ReactNode {
  const ref = useLayoutAnimation<HTMLDivElement>(layoutId, config);

  return (
    <Component ref={ref} style={style} {...props}>
      {children}
    </Component>
  );
}
