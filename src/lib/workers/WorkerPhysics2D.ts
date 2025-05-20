import { Shape2D } from "../types/Shapes";
import { Vector2D } from "../types/Global";
import { WorkerMessage } from "../types/Worker"

interface Element extends Shape2D {
    id: string;
}

class WorkerRender2D {
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

    public static resolvePhysics(nodes: Element[], payload: any, callback: (nodes: Element[]) => void): void {
        const gravity = payload.gravity;
        const dt = payload.dt;
        const dim = payload.dimension;
        
        nodes.forEach(n => {
            if(!n.physics) return;
            
            const { x: xPos, y: yPos } = n.position!;
            let { x: vx, y: vy } = n.velocity!
            vy += gravity * dt;

            const nextPosition = {
                x: xPos + vx * dt,
                y: yPos + vy * dt
            }

            if(dim && nextPosition.y + (n.height as number) > dim.height){
                n.velocity!.y = -vy * 0.2;
                n.velocity!.x = vx;
                n.position = { x: nextPosition.x, y: dim.height - (n.height as number) }
                return;
            }

            n.velocity!.y = vy;
            n.velocity!.x = vx;
            n.position = nextPosition;
        })

        const maxIterations = 2;

        for (let iter = 0; iter < maxIterations; iter++) {
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const a = nodes[i];
                    const b = nodes[j];

                    if(!a.physics || !b.physics) continue;
        
                    if (!WorkerRender2D.checkAABBCollision(a, b)) continue;
        
                    const xa = a.position!.x, ya = a.position!.y;
                    const xb = b.position!.x, yb = b.position!.y;
                    const wa = a.width as number, ha = a.height as number;
                    const wb = b.width as number, hb = b.height as number;
        
                    const overlapX = Math.min(xa + wa, xb + wb) - Math.max(xa, xb);
                    const overlapY = Math.min(ya + ha, yb + hb) - Math.max(ya, yb);
        
                    if (overlapX <= 0 || overlapY <= 0) continue;
        
                    let dx = 0, dy = 0;
        
                    if (overlapX <= overlapY) {
                        dx = xa < xb ? -overlapX / 2 : overlapX / 2;
                        a.position!.x += dx;
                        b.position!.x -= dx;
                        a.velocity!.x = 0;
                        b.velocity!.x = 0;
                    } else {
                        dy = ya < yb ? -overlapY / 2 : overlapY / 2;
                        a.position!.y += dy;
                        b.position!.y -= dy;
                        a.velocity!.y = 0;
                        b.velocity!.y = 0;
                    }
                }
            }
        }
        

        callback(nodes);
    }
}

onmessage = function(e) {
    const payload: WorkerMessage = e.data as WorkerMessage;

    if(payload.type == "physics"){
        const nodes = payload.data.nodes;

        WorkerRender2D.resolvePhysics(nodes, payload.data, (nodes: Element[]) => {
            postMessage({
                type: "physics",
                data: {
                    nodes
                }
            })
        });
    }
};