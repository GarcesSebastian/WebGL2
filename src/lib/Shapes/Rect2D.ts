import { Shape2D } from "../Common/Shape2D"
import { Rect2D as Rect2DProps } from "../types/Shapes";

class Rect2D extends Shape2D {
    constructor(DataRect: Rect2DProps){
        super(DataRect);
        this.createPath();
    }

    public checkPointerCollision(x: number, y: number): boolean {
        const position = this.get("position");
        const width = this.get("width") as number;
        const height = this.get("height") as number;

        return x >= position.x && x <= position.x + width
                && y >= position.y && y <= position.y + height;
    }

    public createPath(): void {
        const width = this.width as number;
        const height = this.height as number;

        this.shapePath = new Path2D();
        this.shapePath.roundRect(0, 0, width, height, this.borderRadius);
        this.pathDirty = false;
    }

    public ensurePath(): void {
        if (this.pathDirty) {
            this.createPath();
        }
    }

    public set<K extends keyof this>(key: K, value: this[K]): void {
        super.set(key, value);

        if (["position", "width", "height", "borderRadius"].includes(key as string)) {
            this.pathDirty = true;
        }
    }

    public update(): void {}

    public draw(): void {
        const ctx = this.ctx;
        this.ensurePath();

        ctx.save();

        ctx.beginPath();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation * Math.PI / 180)

        ctx.shadowColor = this.shadowColor;
        ctx.shadowBlur = this.shadowBlur;
        ctx.shadowOffsetX = this.shadowOffsetX;
        ctx.shadowOffsetY = this.shadowOffsetY;

        ctx.lineJoin = this.lineJoin;
        ctx.lineCap = this.lineCap;

        if (this.background) {
            ctx.fillStyle = this.background;
            ctx.fill(this.shapePath);
        }

        if (this.borderColor) {
            ctx.strokeStyle = this.borderColor;
            ctx.lineWidth = this.borderSize;
            ctx.stroke(this.shapePath);
        }

        ctx.closePath();
        ctx.restore();
    }

    public render(): void {
        this.draw();
        this.update();
    }
}

export { Rect2D }