import type { MotionAnimationConfig } from "../types";
import { useLayoutEffect, useRef } from "react";
import { LayoutManager } from "../utils/LayoutManger";

const LayoutManagerInstance = LayoutManager.getInstance();

const DefaultLayoutConfig: MotionAnimationConfig = {
  duration: 300,
  easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
};

export function useLayoutAnimation<T extends HTMLElement>(
  layoutId?: string,
  config?: MotionAnimationConfig,
  onLayoutAnimationStart?: () => void,
  onLayoutAnimationComplete?: () => void,
): React.RefObject<T | null> {
  const elementRef = useRef<T>(null);
  const animationRef = useRef<Animation>(null);
  const layout = layoutId ? LayoutManagerInstance.getLayout(layoutId) : undefined;
  const configRef = useRef({ ...DefaultLayoutConfig, ...config });
  const onAnimationStartRef = useRef(onLayoutAnimationStart);
  const onAnimationFinishRef = useRef(onLayoutAnimationComplete);

  useLayoutEffect(() => {
    if (!elementRef.current || !layoutId)
      return;

    const currentRect = elementRef.current.getBoundingClientRect();
    LayoutManagerInstance.registerLayout(layoutId, {
      element: elementRef.current,
      rect: currentRect,
    });

    return () => {
      if (layoutId) {
        LayoutManagerInstance.unregisterLayout(layoutId);
      }
      animationRef.current?.cancel();
    };
  }, []);

  useLayoutEffect(() => {
    const element = elementRef.current;

    if (!element || !layoutId) {
      return;
    }

    const currentRect = element.getBoundingClientRect();
    const previousLayout = layout;

    if (previousLayout && previousLayout.rect) {
      // cancel any existing animation
      if (animationRef.current) {
        animationRef.current.cancel();
      }

      // FLIP
      const deltaX = previousLayout.rect.left - currentRect.left;
      const deltaY = previousLayout.rect.top - currentRect.top;
      const deltaScaleX = previousLayout.rect.width / currentRect.width;
      const deltaScaleY = previousLayout.rect.height / currentRect.height;

      const previousTransformOrigin = element.style.transformOrigin;
      const nextTransformOrigin = configRef.current.origin;

      if (previousTransformOrigin !== nextTransformOrigin && nextTransformOrigin) {
        element.style.transformOrigin = nextTransformOrigin;
      }

      animationRef.current = element.animate(
        [
          {
            transform: `translate(${deltaX}px, ${deltaY}px) scale(${deltaScaleX}, ${deltaScaleY})`,
            offset: 0,
          },
          {
            transform: "translate(0px, 0px) scale(1, 1)",
            offset: 1,
          },
        ],
        {
          duration: configRef.current.duration,
          easing: configRef.current.easing,
          fill: "both",
        },
      );

      if (onAnimationStartRef.current) {
        if (animationRef.current.playState === "idle") {
          animationRef.current.addEventListener("start", onAnimationStartRef.current);
        }
        else {
          onAnimationStartRef.current();
        }
      }

      if (onAnimationFinishRef.current) {
        if (animationRef.current.playState === "finished") {
          onAnimationFinishRef.current();
        }
        else {
          animationRef.current.addEventListener("finish", onAnimationFinishRef.current);
        }
      }
    }
  }, []);

  return elementRef;
}
