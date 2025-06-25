import type { AnimationPhase, MotionConfig } from "../types";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

export enum MotionState {
  INITIAL = "initial",
  ANIMATE = "animate",
  EXIT = "exit",
}

const DefaultMotionConfig: MotionConfig = {
  transitions: {
    enter: { duration: 300, easing: "cubic-bezier(0.25, 0.1, 0.25, 1)" },
    exit: { duration: 200, easing: "ease-out" },
  },
};

function createTransformString(phase: AnimationPhase): string {
  const transforms: string[] = [];

  if (phase.scale !== undefined)
    transforms.push(`scale(${phase.scale})`);
  if (phase.x !== undefined)
    transforms.push(`translateX(${phase.x}px)`);
  if (phase.y !== undefined)
    transforms.push(`translateY(${phase.y}px)`);
  if (phase.rotate !== undefined)
    transforms.push(`rotate(${phase.rotate}deg)`);

  return transforms.join(" ");
}

function phaseToKeyframe(phase: AnimationPhase): any {
  const keyframe: any = {};

  const transform = createTransformString(phase);
  if (transform)
    keyframe.transform = transform;

  Object.entries(phase).forEach(([key, value]) => {
    if (!["scale", "x", "y", "rotate"].includes(key)) {
      keyframe[key] = value;
    }
  });

  return keyframe;
}

export function useMotionAnimation<T extends HTMLElement>(
  elementRef: React.RefObject<T | null>,
  config?: MotionConfig,
) {
  const animationRef = useRef<Animation | null>(null);
  const [currentState, setCurrentState] = useState<MotionState>(MotionState.INITIAL);
  const configRef = useRef({ ...DefaultMotionConfig, ...config });
  const finishHandlerRef = useRef<(() => void) | null>(null);

  const cleanup = useCallback(() => {
    if (animationRef.current) {
      if (finishHandlerRef.current) {
        animationRef.current.removeEventListener("finish", finishHandlerRef.current);
        finishHandlerRef.current = null;
      }
      animationRef.current.cancel();
      animationRef.current = null;
    }
  }, []);

  useLayoutEffect(() => {
    if (!elementRef.current)
      return;

    const element = elementRef.current;
    const motionConfig = configRef.current;

    if (motionConfig.phases?.initial) {
      const initialKeyframe = phaseToKeyframe(motionConfig.phases.initial);
      Object.assign(element.style, initialKeyframe);
    }

    if (motionConfig.phases?.animate) {
      const enterConfig = motionConfig.transitions?.enter;

      const keyframes = [
        motionConfig.phases.initial ? phaseToKeyframe(motionConfig.phases.initial) : {},
        phaseToKeyframe(motionConfig.phases.animate),
      ];

      cleanup();

      animationRef.current = element.animate(keyframes, {
        duration: enterConfig?.duration || 300,
        easing: enterConfig?.easing || DefaultMotionConfig.transitions?.enter?.easing,
        delay: enterConfig?.delay || 0,
        fill: "forwards",
      });

      finishHandlerRef.current = () => {
        setCurrentState(MotionState.ANIMATE);
        finishHandlerRef.current = null;
      };

      animationRef.current.addEventListener("finish", finishHandlerRef.current);
    }
    else {
      setCurrentState(MotionState.ANIMATE);
    }

    return cleanup;
  }, [cleanup]);

  useLayoutEffect(() => {
    configRef.current = { ...DefaultMotionConfig, ...config };
  }, [config]);

  const performExitAnimation = useCallback((): Promise<void> => {
    if (!elementRef.current)
      return Promise.resolve();

    return new Promise<void>((resolve) => {
      const element = elementRef.current!;
      const motionConfig = configRef.current;

      if (motionConfig.phases?.exit) {
        const exitConfig = motionConfig.transitions?.exit;
        const currentPhase = motionConfig.phases.animate || {};

        const keyframes = [
          phaseToKeyframe(currentPhase),
          phaseToKeyframe(motionConfig.phases.exit),
        ];

        cleanup();

        const animation = element.animate(keyframes, {
          duration: exitConfig?.duration || DefaultMotionConfig.transitions?.exit?.duration,
          easing: exitConfig?.easing || DefaultMotionConfig.transitions?.exit?.easing,
          delay: exitConfig?.delay,
          fill: "forwards",
        });

        const exitFinishHandler = () => {
          setCurrentState(MotionState.EXIT);
          animation.removeEventListener("finish", exitFinishHandler);
          resolve();
        };

        animation.addEventListener("finish", exitFinishHandler);

        animationRef.current = animation;
      }
      else {
        resolve();
      }
    });
  }, [cleanup]);

  return {
    currentState,
    performExitAnimation,
  };
}
