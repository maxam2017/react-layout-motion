import type { AnimationPhase, MotionAnimationConfig, MotionConfig } from "../types";

import React, { useId } from "react";
import { useLayoutAnimation } from "../hooks/useLayoutAnimation";
import { useMotionAnimation } from "../hooks/useMotionAnimation";

interface MotionProps {
  layout?: boolean;
  layoutId?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;

  initial?: AnimationPhase;
  animate?: AnimationPhase;
  exit?: AnimationPhase;

  transition?: MotionAnimationConfig;
  layoutTransition?: MotionAnimationConfig;

  onLayoutAnimationStart?: () => void;
  onLayoutAnimationComplete?: () => void;
}

export function Motion({
  layout,
  layoutId: propLayoutId,
  children,
  style,
  className,
  as: Component = "div",
  initial,
  animate,
  exit,
  transition,
  layoutTransition,
  onLayoutAnimationStart,
  onLayoutAnimationComplete,
  ...props
}: MotionProps): React.ReactNode {
  const motionConfig: MotionConfig = {
    phases: {
      initial,
      animate,
      exit,
    },
    transitions: {
      enter: transition,
      exit: transition,
    },
  };

  const internalLayoutId = useId();
  const layoutId = propLayoutId || (layout ? internalLayoutId : undefined);

  const elementRef = useLayoutAnimation<HTMLElement>(layoutId, layoutTransition, onLayoutAnimationStart, onLayoutAnimationComplete);
  useMotionAnimation(elementRef, motionConfig);

  return (
    <Component ref={elementRef} style={style} className={className} {...props}>
      {children}
    </Component>
  );
}
