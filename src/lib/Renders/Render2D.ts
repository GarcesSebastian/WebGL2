import { Quality } from "../types/Global"
import { Shape2D } from "../Common/Shape2D"
import { EventsController } from "../Controllers/events.controller";
import { WebGL2 } from "../WebGL2"
import { Render2DHelper } from "../Helpers/render2d.helper";
import { WorkerMessage } from "../types/Worker";
import { ElementShape } from "../types/Shapes";
import { CacheManager } from "../Utils/CacheManager";

class Render2D {
    public WebGL2: WebGL2 | null = null;
    public EventsController: EventsController;

    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;

    public childrens: Map<string, Shape2D> = new Map();

    public Render2DHelper: Render2DHelper;
    public WorkerRender2D: Worker;
    public WorkerPhysics2D: Worker;

    private gravity: number = 0.8;

    constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d", { alpha: true })!;
        this.EventsController = EventsController.getInstance();
        this.Render2DHelper = Render2DHelper.getInstance();

        this.WorkerRender2D = new Worker(new URL("../workers/WorkerRender2D", import.meta.url), { type: "module" });
        this.WorkerPhysics2D = new Worker(new URL("../workers/WorkerPhysics2D", import.meta.url), { type: "module" })

        this.PhysicsWorker2D = this.PhysicsWorker2D.bind(this);

        this.listeners();
    }

    public getChildrens(): Map<string, Shape2D> {
        return this.childrens;
    }

    public setChildren(child: Shape2D): void {
        this.childrens.set(child.getId(), child);
    }

    public getGravity(): number {
        return this.gravity;
    }

    public listeners(): void {
        const c = this.ctx.canvas;
        
        c.addEventListener("click", (e) => this.EventsController.ClickEvent(e, this))
        c.addEventListener("mousedown", (e) => this.EventsController.DragStartEvent(e, this))
        c.addEventListener("mousemove", (e) => this.EventsController.DragMoveEvent(e, this))
        c.addEventListener("mouseup", (e) => this.EventsController.DragEndEvent(e, this))

        this.WorkerRender2D.onmessage = (e) => {
            const payload: WorkerMessage = e.data as WorkerMessage;

            const updated = payload.data.nodes as ElementShape[];

            for(const node of updated){
                const inst = this.getChildrens().get(node.id)
                if(!inst) continue;

                inst.set("position", node.position!);
            }
        }

        this.WorkerPhysics2D.onmessage = (e) => {
            const payload: WorkerMessage = e.data as WorkerMessage;

            const updated = payload.data.nodes as ElementShape[];

            for(const node of updated){
                const inst = this.getChildrens().get(node.id)
                if(!inst) continue;

                inst.set("position", node.position!);
                inst.set("velocity", node.velocity!);
            }

            requestAnimationFrame(() => this.PhysicsWorker2D());
        }

    }

    public PhysicsWorker2D(): void {
        const fps = WebGL2.getInstance().getFPS()!;
        const dt = fps / 60;
        const nodes = CacheManager.getReverseOrderedList();

        this.WorkerPhysics2D.postMessage({
            type: "physics",
            data: {
                nodes,
                gravity: this.gravity,
                dt,
                dimension: { width: this.canvas.width, height: this.canvas.height }
            }
        })
    }

    public start(): void {
        this.WebGL2 = WebGL2.getInstance();
        this.config();
    
        requestAnimationFrame(() => this.PhysicsWorker2D());
    }

    public async render(now: number): Promise<void> {
        this.clear();
        
        const layers = this.Render2DHelper.groupByLayer(this.getChildrens());
        
        for (const [layer, children] of layers) {
            for (const child of children) {
                if (this.Render2DHelper.isObjectVisible(child, this)) {
                    await Promise.resolve(child.render());
                }
            }
        }
    }

    private config(): void {
        this.resize();

        const quality: Quality = this.WebGL2?.getQuality()!;

        switch (quality) {
            case "low":
                this.ctx.imageSmoothingEnabled = false;
                break;
            case "medium":
                this.ctx.imageSmoothingEnabled = true;
                break;
            case "high":
                this.ctx.imageSmoothingEnabled = true;
                break;
        }
    }

    private resize(): void {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    private clear(): void {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    }
}

export { Render2D };