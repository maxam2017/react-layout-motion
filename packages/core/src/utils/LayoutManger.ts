interface Layout {
  element: HTMLElement;
  rect: DOMRect;
}

interface LayoutManagerInterface {
  registerLayout: (id: string, layout: Layout) => void;
  unregisterLayout: (id: string) => void;
  getLayout: (id: string) => Layout | undefined;
}

export class LayoutManager implements LayoutManagerInterface {
  private static instance: LayoutManager;

  private layoutMap: Map<string, Layout> = new Map();

  public registerLayout(id: string, layout: Layout): void {
    this.layoutMap.set(id, layout);
  }

  public unregisterLayout(id: string): void {
    this.layoutMap.delete(id);
  }

  public getLayout(id: string): { element: HTMLElement; rect: DOMRect } | undefined {
    return this.layoutMap.get(id);
  }

  public static getInstance(): LayoutManager {
    if (!LayoutManager.instance) {
      LayoutManager.instance = new LayoutManager();
    }
    return LayoutManager.instance;
  }
}
