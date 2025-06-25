import type { AnimationPhase, MotionAnimationConfig, MotionConfig } from "../types";

import React from "react";
import { useLayoutAnimation } from "../hooks/useLayoutAnimation";
import { useMotionAnimation } from "../hooks/useMotionAnimation";

interface MotionProps {
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
}

export function Motion({
  layoutId,
  children,
  style,
  className,
  as: Component = "div",
  initial,
  animate,
  exit,
  transition,
  layoutTransition,
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

  const elementRef = useLayoutAnimation<HTMLElement>(layoutId, layoutTransition);
  useMotionAnimation(elementRef, motionConfig);

  return (
    <Component ref={elementRef} style={style} className={className} {...props}>
      {children}
    </Component>
  );
}
