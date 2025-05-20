import { WebGL2 } from "../WebGL2"
import { Render2D } from "../Renders/Render2D";
import { Vector2D, Dimension, Quality } from "../types/Global";
import { Rect2D, Shape2D as Shape2DProps } from "../types/Shapes";
import { EventsMap } from "../types/Arguments";
import { CacheManager } from "../Utils/CacheManager";

abstract class Shape2D {
    public WebGL2: WebGL2;
    public Render2D: Render2D;    
    public ctx: CanvasRenderingContext2D;
    public shapePath: Path2D;
    public pathDirty: boolean = true;

    public layer: number = 0;

    public position: Vector2D;
    public velocity: Vector2D;
    public rotation: number;
    public width: Dimension;
    public height: Dimension;
    public radius: number;

    public borderRadius: number;

    public lineJoin: CanvasLineJoin;
    public lineCap: CanvasLineCap;
    public shadowColor: string;
    public shadowBlur: number;
    public shadowOffsetX: number;
    public shadowOffsetY: number;

    public color: string;
    public background: string;
    public borderColor: string;
    public borderSize: number;

    public paddingTop: number;
    public paddingRight: number;
    public paddingBottom: number;
    public paddingLeft: number;
    
    public collisionable: boolean;
    public draggable: boolean;
    public physics: boolean;

    private id: string;

    constructor(DataShape: Shape2DProps){
        this.id = Math.random().toString(36).substring(2, 15);

        this.layer = DataShape.layer || 0;

        this.position = DataShape.position || { x: 0, y: 0 };
        this.velocity = DataShape.velocity || { x: 1, y: 1 };
        this.rotation = DataShape.rotation || 0;
        this.width = DataShape.width || "auto";
        this.height = DataShape.height || "auto";
        this.radius = DataShape.radius || 0;

        this.borderRadius = DataShape.borderRadius || 0;

        this.color = DataShape.color || "white";
        this.background = DataShape.background || "transparent";
        this.borderColor = DataShape.borderColor || "transparent";
        this.borderSize = DataShape.borderSize || 0;

        this.lineJoin = DataShape.lineJoin || "miter";
        this.lineCap = DataShape.lineCap || "butt";
        this.shadowColor = DataShape.shadowColor || "";
        this.shadowBlur = DataShape.shadowBlur || 0;
        this.shadowOffsetX = DataShape.shadowOffsetX || 0;
        this.shadowOffsetY = DataShape.shadowOffsetY || 0;
      
        this.paddingTop = DataShape.paddingTop || 0;
        this.paddingRight = DataShape.paddingRight || 0;
        this.paddingBottom = DataShape.paddingBottom || 0;
        this.paddingLeft = DataShape.paddingLeft || 0;

        this.collisionable = DataShape.collisionable == undefined ? true : DataShape.collisionable;
        this.draggable = DataShape.draggable == undefined ? false : DataShape.draggable;
        this.physics = DataShape.physics == undefined ? false : DataShape.physics;

        this.WebGL2 = WebGL2.getInstance();
        this.Render2D = this.WebGL2.render2D;
        this.ctx = this.Render2D.ctx;

        this.Render2D.childrens.set(this.id, this);
        CacheManager.addChild(this);

        this.shapePath = new Path2D();
        
        this.config();
    }

    public abstract checkPointerCollision(x: number, y: number): boolean;

    public on<T extends keyof EventsMap>(eventName: T, listener: (args: EventsMap[T]) => void): void {
        this.Render2D.EventsController.on(eventName, listener);
    }

    public off<T extends keyof EventsMap>(eventName: T, listener: (args: EventsMap[T]) => void): void {
        this.Render2D.EventsController.off(eventName, listener);
    }

    public set<K extends keyof this>(key: K, value: this[K]): void {
        this[key] = value;
        CacheManager.addChild(this);
    }

    public get<K extends keyof this>(key: K): this[K] {
        return this[key];
    }

    public getAttributes(): Rect2D {
        const payload: Rect2D = {
            position: this.get("position"),
            velocity: this.get("velocity"),
            rotation: this.get("rotation"),
            width: this.get("width"),
            height: this.get("height"),
            radius: this.get("radius"),
            borderRadius: this.get("borderRadius"),
            color: this.get("color"),
            background: this.get("background"),
            borderColor: this.get("borderColor"),
            borderSize: this.get("borderSize"),
            lineJoin: this.get("lineJoin"),
            lineCap: this.get("lineCap"),
            shadowColor: this.get("shadowColor"),
            shadowBlur: this.get("shadowBlur"),
            shadowOffsetX: this.get("shadowOffsetX"),
            shadowOffsetY: this.get("shadowOffsetY"),
            paddingTop: this.get("paddingTop"),
            paddingRight: this.get("paddingRight"),
            paddingBottom: this.get("paddingBottom"),
            paddingLeft: this.get("paddingLeft"),
            layer: this.get("layer"),
            collisionable: this.get("collisionable"),
            draggable: this.get("draggable"),
            physics: this.get("physics"),
        }

        return payload;
    }

    public getRect(): DOMRect {
        const position = this.get("position");
        const width = this.get("width");
        const height = this.get("height");

        return new DOMRect(position.x, position.y, width as number, height as number);
    }

    public getId(): string {
        return this.id;
    }

    public config(): void {
        const quality: Quality = this.WebGL2?.getQuality();

        switch (quality) {
            case "low":
                this.shadowBlur = 0;
                break;
            case "medium":
                this.shadowBlur = 2;
                break;
            case "high":
                this.shadowBlur = 5;
                break;
        }
    }

    public destroy(): void {
        this.Render2D.childrens.delete(this.id)
    }

    public draw(): void {}

    public render(): void {}
}

export { Shape2D };