import { Render2D } from "../Renders/Render2D";
import { ShapeClickEvent } from "../Types/Arguments";
import { Shape2D } from "../Common/Shape2D";
import { Vector2D } from "../Types/Global";
import { WorkerMessage } from "../Types/Worker";
import { CacheManager } from "../Utils/CacheManager";

class EventsFunctions {
    private isDragging: boolean = false;
    private elementDrag: Shape2D | null = null;
    private lastPositionDrag: Vector2D = { x: 0, y: 0 };
    private lastPositionClick: Vector2D = { x: 0, y: 0 };

    public isDrag(): boolean {
        return this.isDragging;
    }

    public ClickEvent(e: MouseEvent, render2D: Render2D): void {
        const click = (child: Shape2D, offsetX: number, offsetY: number) => {
            const ev: ShapeClickEvent = {
                x: offsetX,
                y: offsetY,
                target: child
            }
            
            render2D.EventsController.emit("click", ev)
        }

        render2D.WorkerRender2D.postMessage({
            type: "click",
            data: {
                nodes: CacheManager.getReverseOrderedList(),
                x: e.offsetX,
                y: e.offsetY
            }
        })

        render2D.WorkerRender2D.onmessage = function(e) {
            const payload: WorkerMessage = e.data as WorkerMessage;

            if(payload.type == "click") {
                const id = payload.data.elementClick;
                const child = render2D.childrens.get(id);

                if(!child) return;

                click(child, payload.data.x, payload.data.y);
            }
        }
    }

    public DragStartEvent(e: MouseEvent, render2D: Render2D): void {
        const drag = (child: Shape2D, offsetX: number, offsetY: number) => {
            this.isDragging = true;
            this.elementDrag = child;

            const ev: ShapeClickEvent = {
                x: offsetX,
                y: offsetY,
                target: child
            }
            render2D.EventsController.emit("dragstart", ev)
            this.lastPositionDrag = child.get("position");
            this.lastPositionClick = { x: offsetX, y: offsetY };
        }

        render2D.WorkerRender2D.postMessage({
            type: "dragstart",
            data: {
                nodes: CacheManager.getReverseOrderedList(),
                x: e.offsetX,
                y: e.offsetY
            }
        })

        render2D.WorkerRender2D.onmessage = function(e) {
            const payload: WorkerMessage = e.data as WorkerMessage;

            if(payload.type == "dragstart") {
                const id = payload.data.elementDrag;
                const child = render2D.childrens.get(id);

                if(!child) return;

                drag(child, payload.data.x, payload.data.y);
            }
        }
    }

    public DragMoveEvent(e: MouseEvent, render2D: Render2D): void {
        if(!this.isDragging || !this.elementDrag) return;

        const { offsetX, offsetY } = e;

        const ev: ShapeClickEvent = {
            x: offsetX,
            y: offsetY,
            target: this.elementDrag
        }

        if(this.elementDrag.get("draggable")){
            const diffX = offsetX - this.lastPositionClick.x;
            const diffY = offsetY - this.lastPositionClick.y;

            const newPos = {
                x: this.lastPositionDrag.x + diffX,
                y: this.lastPositionDrag.y + diffY
            }

            this.elementDrag.set("position", newPos)
        }

        render2D.EventsController.emit("dragmove", ev)
    }

    public DragEndEvent(e: MouseEvent, render2D: Render2D): void {
        render2D.EventsController.emit("dragend", {
            x: e.offsetX,
            y: e.offsetY,
            target: this.elementDrag!
        })

        this.isDragging = false;
        this.elementDrag = null;
    }
}

export { EventsFunctions };