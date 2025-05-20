import { Render2D } from "../Renders/Render2D";
import { Shape2D } from "../Common/Shape2D";

class Render2DHelper {
    public static instance: Render2DHelper;

    constructor(){}

    public static getInstance(): Render2DHelper {
        if(!Render2DHelper.instance){
            Render2DHelper.instance = new Render2DHelper();
        }

        return Render2DHelper.instance;
    }

    public isObjectVisible(object: Shape2D, render2D: Render2D): boolean {
        const rect = object.getRect();
        const canvasRect = render2D.canvas.getBoundingClientRect();

        return rect.left < canvasRect.right &&
                rect.right > canvasRect.left &&
                rect.top < canvasRect.bottom &&
                rect.bottom > canvasRect.top;
    }

    public groupByLayer(childrens: Map<string, Shape2D>): [number, Shape2D[]][] {
        const groups = new Map<number, Shape2D[]>();

        for (const child of childrens.values()) {
            const layer = child.get("layer") ?? 0;
            if (!groups.has(layer)) groups.set(layer, []);
            groups.get(layer)!.push(child);
        }

        return Array.from(groups.entries())
            .sort(([layerA], [layerB]) => layerA - layerB);
    }
}

export { Render2DHelper }
