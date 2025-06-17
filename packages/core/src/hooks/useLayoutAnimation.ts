import type { LayoutAnimationConfig } from "../types";

import { useLayoutEffect, useRef } from "react";
import { LayoutManager } from "../utils/LayoutManger";

const LayoutMangerInstance = LayoutManager.getInstance();

const DefaultAnimationConfig: LayoutAnimationConfig = {
  duration: 300,
  easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
};

export function useLayoutAnimation<T extends HTMLElement>(layoutId: string, config?: LayoutAnimationConfig): React.RefObject<T | null> {
  const elementRef = useRef<T>(null);
  const animationRef = useRef<Animation>(null);
  const layout = LayoutMangerInstance.getLayout(layoutId);
  const configRef = useRef({ ...DefaultAnimationConfig, ...config });

  useLayoutEffect(() => {
    if (!elementRef.current || !layoutId)
      return;

    const currentRect = elementRef.current.getBoundingClientRect();
    LayoutMangerInstance.registerLayout(layoutId, {
      element: elementRef.current,
      rect: currentRect,
    });

    return () => {
      if (layoutId) {
        LayoutMangerInstance.unregisterLayout(layoutId);
      }
      if (animationRef.current) {
        animationRef.current.cancel();
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (!elementRef.current || !layoutId)
      return;

    const currentRect = elementRef.current.getBoundingClientRect();
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

      animationRef.current = elementRef.current.animate(
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
    }
  }, []);

  return elementRef;
}
