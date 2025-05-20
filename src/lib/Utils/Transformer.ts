import { Vector2D } from "../types/Global";
import { Shape2D } from "../Common/Shape2D";
import { Render2D } from "../Renders/Render2D";
import { Rect2D } from "../Shapes/Rect2D";
import { WebGL2 } from "../WebGL2";

const NODES_ATTACHS = {
    "top-right": { x: 1, y: 0 },
    "top-left": { x: 0, y: 0 },
    "bottom-right": { x: 1, y: 1 },
    "bottom-left": { x: 0, y: 1 },
}

type NodeAttachKey = keyof typeof NODES_ATTACHS;

class Transformer {
    public WebGL2: WebGL2;
    public Render2D: Render2D;    
    public ctx: CanvasRenderingContext2D;

    public childrens: Map<string, Shape2D> = new Map();

    private nodes: Rect2D[] = [];
    private center: Rect2D | null = null;

    private position: Vector2D = { x: 0, y: 0 };
    private width: number = 100;
    private height: number = 100;

    private nodeSize: number = 10;

    private padding: number = 0;

    constructor(){
        this.WebGL2 = WebGL2.getInstance();
        this.Render2D = this.WebGL2.render2D;
        this.ctx = this.Render2D.ctx;

        this.update();
    }

    public add(node: Shape2D): void {
        this.childrens.set(node.getId(), node);
        this.update();
    }

    public resize(): void {
        const { minX, minY, maxX, maxY } = Array.from(this.childrens.values()).reduce(
            (acc, child) => {
              const { x, y } = child.get("position") as Vector2D;
              const w = child.get("width")  as number;
              const h = child.get("height") as number;
        
              return {
                minX: Math.min(acc.minX, x),
                minY: Math.min(acc.minY, y),
                maxX: Math.max(acc.maxX, x + w),
                maxY: Math.max(acc.maxY, y + h),
              };
            },

            { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
          );

        this.position = { x: minX, y: minY }
        this.width = maxX - minX;
        this.height = maxY - minY;
    }

    private update(): void {
        if(this.childrens.size === 0) return;

        if(this.center){
            this.center.destroy();
        }

        this.nodes.forEach(node => {
            node.destroy();
        })

        this.resize();

        const xCenter = this.position.x - this.padding;
        const yCenter = this.position.y - this.padding;

        const widthCenter = this.width + this.padding * 2;
        const heightCenter = this.height + this.padding * 2;

        this.center = this.WebGL2.createRect2D({
            position: { x: xCenter, y: yCenter },
            width: widthCenter,
            height: heightCenter,
            background: "rgba(255, 0, 0, 0.3)",
            borderColor: "rgba(255, 0, 0, 1)",
            borderSize: 2,
            collisionable: false
        })

        Array.from(["top-left", "top-right", "bottom-left", "bottom-right"] as NodeAttachKey[]).forEach((value) => {
            const attach = NODES_ATTACHS[value]

            const xNormalized = xCenter - this.nodeSize / 2 + widthCenter * attach.x;
            const yNormalized = yCenter - this.nodeSize / 2 + heightCenter * attach.y;

            this.nodes.push(this.WebGL2.createRect2D({
                position: { x: xNormalized, y: yNormalized },
                width: this.nodeSize,
                height: this.nodeSize,
                background: "rgba(0, 255, 0, 0.3)",
                borderColor: "rgba(0, 255, 0, 1)",
                borderSize: 2,
                collisionable: false
            }))
        })
    }
}

export { Transformer }