import { ElementShape, Rect2D } from "../types/Shapes";
import { Shape2D } from "../Common/Shape2D";

class CacheManager {
  private static lookup = new Map<string, ElementShape>();
  private static orderedList: ElementShape[] = [];

  public static addChild(instance: Shape2D): void {
    const id = instance.getId();
    const attrs: Rect2D = instance.getAttributes();
    const element: ElementShape = { ...attrs, id };

    if (CacheManager.lookup.has(id)) {
      CacheManager.removeChild(id);
    }

    const layer = element.layer as number;
    let lo = 0, hi = CacheManager.orderedList.length;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      const midLayer = CacheManager.orderedList[mid].layer as number;
      if (midLayer < layer) lo = mid + 1;
      else hi = mid;
    }
    CacheManager.orderedList.splice(lo, 0, element);

    CacheManager.lookup.set(id, element);
  }

  public static removeChild(id: string): void {
    const element = CacheManager.lookup.get(id);
    if (!element) return;
    const idx = CacheManager.orderedList.findIndex(e => e.id === id);
    if (idx >= 0) CacheManager.orderedList.splice(idx, 1);
    CacheManager.lookup.delete(id);
  }

  public static clear(): void {
    CacheManager.lookup.clear();
    CacheManager.orderedList = [];
  }

  public static getOrderedList(): ElementShape[] {
    return [...CacheManager.orderedList];
  }

  public static getReverseOrderedList(): ElementShape[] {
    return [...CacheManager.orderedList].reverse();
  }

  public static *values(): IterableIterator<ElementShape> {
    yield* CacheManager.orderedList;
  }
}

export { CacheManager };