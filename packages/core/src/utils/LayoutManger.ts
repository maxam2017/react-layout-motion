export interface Layout {
  element: HTMLElement;
  rect: DOMRect;
}

interface LayoutManagerInterface {
  registerLayout: (id: string, element: HTMLElement) => string;
  unregisterLayout: (id: string) => void;
  getLayout: (id: string) => Layout | null;
  getPreviousLayout: (id: string) => Layout | null;
}

export class LayoutManager implements LayoutManagerInterface {
  private static instance: LayoutManager;

  private layoutMap: Map<string, Layout> = new Map();
  private previousLayoutMap: Map<string, Layout | null> = new Map();

  public static getInstance(): LayoutManager {
    if (!LayoutManager.instance) {
      LayoutManager.instance = new LayoutManager();
    }
    return LayoutManager.instance;
  }

  public registerLayout(layoutId: string, element: HTMLElement): string {
    const viewport = element.closest("[data-viewport-id]");
    const rect = viewport ? this.getRelativeRect(element, viewport) : element.getBoundingClientRect();
    const viewportId = viewport ? viewport.getAttribute("data-viewport-id") : "root";
    const viewportLayoutId = `${viewportId}:${layoutId}`;

    this.layoutMap.set(viewportLayoutId, { element, rect });

    return viewportLayoutId;
  }

  public unregisterLayout(id: string): void {
    const layout = this.layoutMap.get(id);
    this.layoutMap.delete(id);
    this.previousLayoutMap.set(id, layout || null);
  }

  public getLayout(id: string): Layout | null {
    return this.layoutMap.get(id) || null;
  }

  public getPreviousLayout(id: string): Layout | null {
    return this.previousLayoutMap.get(id) || null;
  }

  private getRelativeRect(element: HTMLElement, viewport: Element): DOMRect {
    const elementRect = element.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();

    return new DOMRect(
      elementRect.left - viewportRect.left,
      elementRect.top - viewportRect.top,
      elementRect.width,
      elementRect.height,
    );
  }
}
