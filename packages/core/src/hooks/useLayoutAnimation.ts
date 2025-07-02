import type { MotionAnimationConfig } from "../types";
import { useLayoutEffect, useRef } from "react";
import { useViewportId } from "../components/Viewport";
import { LayoutManager } from "../utils/LayoutManger";
import { noop } from "../utils/noop";
import { useEvent } from "./useEvent";

const LayoutManagerInstance = LayoutManager.getInstance();

const DefaultLayoutConfig: MotionAnimationConfig = {
  duration: 300,
  easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
};

export function useLayoutAnimation<T extends HTMLElement>(
  layoutId?: string,
  config?: MotionAnimationConfig,
  onLayoutAnimationStart = noop,
  onLayoutAnimationComplete = noop,
): React.RefObject<T | null> {
  const elementRef = useRef<T>(null);
  const animationRef = useRef<Animation>(null);

  const configRef = useRef({ ...DefaultLayoutConfig, ...config });
  const onAnimationStart = useEvent(onLayoutAnimationStart);
  const onAnimationFinish = useEvent(onLayoutAnimationComplete);

  const viewportId = useViewportId();
  const viewportLayoutId = layoutId ? `${viewportId}:${layoutId}` : null;
  const layout = viewportLayoutId ? LayoutManagerInstance.getLayout(viewportLayoutId) : null;

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element || !layoutId) {
      return;
    }

    const viewportLayoutId = LayoutManagerInstance.registerLayout(layoutId, element);

    return () => {
      LayoutManagerInstance.unregisterLayout(viewportLayoutId);
      animationRef.current?.cancel();
    };
  }, []);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element || !viewportLayoutId) {
      return;
    }

    const currentLayout = LayoutManagerInstance.getLayout(viewportLayoutId);
    const previousLayout = layout;

    if (previousLayout && previousLayout.rect && currentLayout) {
      // cancel any existing animation
      if (animationRef.current) {
        animationRef.current.cancel();
      }

      // FLIP
      const deltaX = previousLayout.rect.left - currentLayout.rect.left;
      const deltaY = previousLayout.rect.top - currentLayout.rect.top;
      const deltaScaleX = previousLayout.rect.width / currentLayout.rect.width;
      const deltaScaleY = previousLayout.rect.height / currentLayout.rect.height;

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

      if (animationRef.current.playState === "idle") {
        animationRef.current.addEventListener("start", onAnimationStart);
      }
      else {
        onAnimationStart();
      }

      if (animationRef.current.playState === "finished") {
        onAnimationFinish();
      }
      else {
        animationRef.current.addEventListener("finish", onAnimationFinish);
      }
    }
  }, []);

  return elementRef;
}
