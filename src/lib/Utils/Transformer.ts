import { Vector2D } from "../Types/Global";
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

    private nodes: Map<string, Rect2D> = new Map();
    private center: Rect2D | null = null;

    private position: Vector2D = { x: 0, y: 0 };
    private width: number = 100;
    private height: number = 100;

    private nodeSize: number = 10;

    private padding: number = 0;

    constructor(){
        this.WebGL2 = WebGL2.getInstance();
        this.Render2D = this.WebGL2.Render2D;
        this.ctx = this.Render2D.ctx;

        this.createCenter();
        this.createNodes();

        this.update();
    }

    public add(node: Shape2D): void {
        if(node.physics) return;

        node.set("ignorable", true);
        this.childrens.set(node.getId(), node);
        this.update();

        this.show();
    }

    public show(): void {
        this.nodes.forEach((node) => node.set("visible", true));
        this.center?.set("visible", true);
    }

    public hide(): void {
        this.nodes.forEach((node) => node.set("visible", false));
        this.center?.set("visible", false);
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

        this.updateCenter();
        this.updateNodes();
    }

    private events(): void {
        if(!this.center) return;

        this.center.on("dragmove", (e) => {
            const { x, y } = e;
            this.move({ x, y });
        })
    }

    private getPositionNormalized(): Vector2D {
        return { x: this.position.x - this.padding, y: this.position.y - this.padding }
    }

    private getWidthNormalized(): number {
        return this.width + this.padding * 2;
    }

    private getHeightNormalized(): number {
        return this.height + this.padding * 2;
    }

    private createCenter(): void {
        if(this.center) return;

        this.center = this.WebGL2.createRect2D({
            position: this.getPositionNormalized(),
            width: this.getWidthNormalized(),
            height: this.getHeightNormalized(),
            background: "rgba(255, 0, 0, 0.3)",
            borderColor: "rgba(255, 0, 0, 1)",
            borderSize: 2,
            collisionable: false,
            draggable: true,
            visible: false
        })

        this.center.new("transformer", true);

        this.events();
    }

    private updateCenter(): void {
        const position = this.getPositionNormalized();
        const width = this.getWidthNormalized();
        const height = this.getHeightNormalized();

        this.center?.set("position", position);
        this.center?.set("width", width);
        this.center?.set("height", height);
    }

    private createNodes(): void {
        Object.keys(NODES_ATTACHS).forEach((key) => {
            const attach = NODES_ATTACHS[key as NodeAttachKey];

            const xNormalized = this.getPositionNormalized().x - this.nodeSize / 2 + this.getWidthNormalized() * attach.x;
            const yNormalized = this.getPositionNormalized().y - this.nodeSize / 2 + this.getHeightNormalized() * attach.y;

            const node = this.WebGL2.createRect2D({
                position: { x: xNormalized, y: yNormalized },
                width: this.nodeSize,
                height: this.nodeSize,
                background: "rgba(0, 255, 0, 0.3)",
                borderColor: "rgba(0, 255, 0, 1)",
                borderSize: 2,
                collisionable: false,
                draggable: true,
                visible: false
            })

            this.nodes.set(key, node)
            node.new("keyAttach", key)
        })
    }

    private updateNodes(): void {
        this.nodes.forEach((node, key) => {
            const attachData = NODES_ATTACHS[key as NodeAttachKey];

            const position = this.getPositionNormalized();
            const width = this.getWidthNormalized();
            const height = this.getHeightNormalized();

            const xNormalized = position.x - this.nodeSize / 2 + width * attachData.x;
            const yNormalized = position.y - this.nodeSize / 2 + height * attachData.y;

            node.set("position", { x: xNormalized, y: yNormalized });
        })
    }

    private move(position: Vector2D): void {
        this.position = position;

        this.childrens.forEach((child) => {
            child.set("position", { x: position.x, y: position.y });
        })

        this.updateCenter();
        this.updateNodes();
    }

    private update(): void {
        if(this.childrens.size === 0) return;
        this.resize();
    }
}

export { Transformer }