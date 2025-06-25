type AnimationValue = string | number;

export interface MotionAnimationConfig {
  duration?: number;
  easing?: string;
  delay?: number;
  origin?: "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center" | "center-top" | "center-bottom" | "center-left" | "center-right";
}

export interface AnimationPhase {
  opacity?: number;
  scale?: number;
  x?: number;
  y?: number;
  rotate?: number;
  [key: string]: AnimationValue | undefined;
}

export interface MotionAnimationPhases {
  initial?: AnimationPhase;
  animate?: AnimationPhase;
  exit?: AnimationPhase;
}

export interface MotionTransitions {
  enter?: MotionAnimationConfig;
  update?: MotionAnimationConfig;
  exit?: MotionAnimationConfig;
}

export interface MotionConfig {
  phases?: MotionAnimationPhases;
  transitions?: MotionTransitions;
}
