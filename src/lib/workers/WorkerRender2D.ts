import { Shape2D } from "../types/Shapes";
import { Vector2D } from "../types/Global";
import { WorkerMessage } from "../types/Worker"

interface Element extends Shape2D {
    id: string;
}

class WorkerRender2D {
    public static checkPointerCollision(x: number, y: number, node: Element): boolean {
        const position = node.position as Vector2D;
        const width = node.width as number;
        const height = node.height as number;

        if(x >= position.x && x <= position.x + width && y >= position.y && y <= position.y + height) {
            return true;
        }

        return false;
    }

    public static checkAABBCollision(a: Element, b: Element): boolean {
        const ax = a.position!.x;
        const ay = a.position!.y;
        const aw = a.width as number;
        const ah = a.height as number;
        const bx = b.position!.x;
        const by = b.position!.y;
        const bw = b.width as number;
        const bh = b.height as number;
        return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
    }

    public static checkCollision(nodes: Element[], x: number, y: number, callback: (node: Element) => void): void {
        let stopped = false;
        
        nodes.forEach((node: Element) => {
            if(stopped) return;

            const isCollision = WorkerRender2D.checkPointerCollision(x, y, node);

            if(isCollision){
                callback(node);
                stopped = true;
            }
        })
    }

    public static checkLimitCollision(node: Element, dimension: { width: number, height: number }): boolean {
        const { x, y } = node.position!;
        const width = node.width as number;
        const height = node.height as number;

        if(y + height >= dimension.height) return true;

        return false;
    }
}

onmessage = function(e) {
    const payload: WorkerMessage = e.data as WorkerMessage;

    if(payload.type == "dragstart") {
        const nodes = payload.data.nodes;

        WorkerRender2D.checkCollision(nodes, payload.data.x, payload.data.y, (node: Element) => {
            postMessage({
                type: "dragstart",
                data: {
                    elementDrag: node.id,
                    x: payload.data.x,
                    y: payload.data.y
                }
            })
        })
    }

    if(payload.type == "click") {
        const nodes = payload.data.nodes;

        WorkerRender2D.checkCollision(nodes, payload.data.x, payload.data.y, (node: Element) => {
            postMessage({
                type: "click",
                data: {
                    elementClick: node.id,
                    x: payload.data.x,
                    y: payload.data.y
                }
            })
        })
    }
};