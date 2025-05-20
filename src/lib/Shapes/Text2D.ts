import { FontFamily, FontSize, FontStyle, FontVariant, FontWeight, TextAlign, TextBaseline, TextDirection } from "../Types/Global"
import { Text2D as Text2DProps } from "../Types/Shapes"
import { Shape2D } from "../Common/Shape2D"
import { Text2D as Text2DUtils } from "../Utils/Text2D"

interface states {
    widthAuto: boolean,
    heightAuto: boolean
}

const defaultStates: states = {
    widthAuto: false,
    heightAuto: false
}

class Text2D extends Shape2D {
    public text: string;
    public fontSize: FontSize;
    public fontFamily: FontFamily;
    public fontWeight: FontWeight;
    public fontStyle: FontStyle;
    public fontVariant: FontVariant;
    public textAlign: TextAlign;
    public textBaseline: TextBaseline;
    public textDirection: TextDirection;
    public spacingY: number;
    public spacingX: number;

    private displayWidth: number = 0;
    private displayHeight: number = 0;
    private textMaxLength: string;
    private states: states;

    constructor(DataText: Text2DProps){
        super(DataText);

        this.states = defaultStates;
        this.text = DataText.text;
        this.spacingY = DataText.spacingY || 0;
        this.spacingX = DataText.spacingX || 0;
        this.fontFamily = DataText.fontFamily || "Arial";
        this.fontSize = DataText.fontSize || "20px";
        this.fontWeight = DataText.fontWeight || "normal";
        this.fontStyle = DataText.fontStyle || "normal";
        this.fontVariant = DataText.fontVariant || "normal";
        this.textAlign = DataText.textAlign || "left";
        this.textBaseline = DataText.textBaseline || "top";
        this.textDirection = DataText.textDirection || "ltr";
        this.textMaxLength = Text2DUtils.getTextMaxLength(DataText.text.split("\n"))

        this.draw();
        this.start();
        this.update();

        if(DataText.onLoaded){
            DataText.onLoaded(this);
        }
    }

    public checkPointerCollision(x: number, y: number): boolean {
        return false;
    }

    private setState<K extends keyof states>(key: K, value: states[K]): void {
        this.states[key] = value;
    }

    private getState<K extends keyof states>(key: K): states[K] {
        return this.states[key]
    }

    private start(): void {
        const widthText = this.getWidthText();
        const heightText = this.getHeightText();

        if(this.width == "auto"){
            this.setState("widthAuto", true);
        }

        if(this.height == "auto"){
            this.setState("heightAuto", true);
        }
     
        this.displayWidth = widthText;
        this.displayHeight = heightText;
    }

    public getWidthAbsolute(): number {
        return this.getWidthText() + this.paddingRight + this.paddingLeft + this.borderSize;
    }

    public getWidthText(): number {
        const textMeasure = this.ctx.measureText(this.textMaxLength);
        const displayWidth = textMeasure.width

        return this.width == "auto" ? displayWidth : this.width;;
    }

    public getHeightText(): number {
        const textMeasure = this.ctx.measureText(this.textMaxLength);
        const displayHeight = textMeasure.actualBoundingBoxAscent + textMeasure.actualBoundingBoxDescent;

        return this.height == "auto" ? displayHeight : this.height;
    }

    public getTextMaxLength(): string {
        return this.textMaxLength;
    }

    public getRect(): DOMRect {
        const position = this.get("position");
        const width = this.getWidthAbsolute();
        const height = this.getHeightText();

        return new DOMRect(position.x, position.y, width, height);
    }

    private update(): void {
        const widthText = this.getWidthText();
        const heightText = this.getHeightText();

        this.displayWidth = this.getState("widthAuto") ? widthText : this.width as number;
        this.displayHeight = this.getState("heightAuto") ? heightText : this.height as number;
    }

    public setText(text: string): void {
        this.text = text;
        this.textMaxLength = Text2DUtils.getTextMaxLength(text.split("\n"))
    }

    public draw(): void {
        const ctx = this.ctx;
        const lines = this.text.split("\n");
        const textMeasure = this.ctx.measureText(this.textMaxLength);

        const lineHeight = this.displayHeight;
        const contentWidth = this.displayWidth;
        const heightText = textMeasure.actualBoundingBoxAscent + textMeasure.actualBoundingBoxDescent;

        const totalWidth  = contentWidth + this.paddingLeft + this.paddingRight;
        const totalHeight = lineHeight * lines.length + this.paddingTop + this.paddingBottom + this.borderSize + (this.spacingY * (lines.length - 1));
        
        const x0 = this.position.x;
        const y0 = this.position.y;

        this.ctx.beginPath();

        ctx.rotate(this.rotation * Math.PI / 180)
        
        ctx.shadowColor = this.shadowColor;
        ctx.shadowBlur = this.shadowBlur;
        ctx.shadowOffsetX = this.shadowOffsetX;
        ctx.shadowOffsetY = this.shadowOffsetY;

        if (this.background) {
            ctx.fillStyle = this.background;
            ctx.roundRect(x0, y0, totalWidth, totalHeight, this.borderRadius);
            ctx.fill();
        }
        
        ctx.direction = this.textDirection
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
        ctx.font = `${this.fontStyle} ${this.fontVariant} ${this.fontWeight} ${this.fontSize} ${this.fontFamily}`;
        ctx.fillStyle = this.color;
        for (let i = 0; i < lines.length; i++) {
            const text = lines[i].trim();
            const tx = x0 + this.paddingLeft + (this.spacingX * i);
            const ty = y0 + this.paddingTop + (i * heightText) + (i * this.spacingY);
            ctx.fillText(text, tx, ty);
        }
        
        if (this.borderSize && this.borderColor) {
            ctx.strokeStyle = this.borderColor;
            ctx.lineWidth = this.borderSize;
            ctx.roundRect(x0, y0, totalWidth, totalHeight, this.borderRadius);
            ctx.stroke();
        }

        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        this.ctx.closePath();
    }
      

    public render(): void {
        this.draw();
        this.update();
    }
}

export { Text2D }