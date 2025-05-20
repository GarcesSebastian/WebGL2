import { Render2D } from "../Renders/Render2D";
import { Text2D } from "../Shapes/Text2D";

class FPS {
    public render2D: Render2D;

    public logs: boolean = false;

    protected fpsInstance: Text2D | undefined;
    protected fps: number = 60;

    protected frameCount: number = 0;
    protected lastTime: number = 0;

    constructor(Render2D: Render2D){
        this.render2D = Render2D;
    }

    private getTextLog(): string {
        const fpsText = `FPS: ${this.fps}`
        const objectsText = `Objects: ${this.render2D.childrens.size}`

        const textLog = `${fpsText}\n${objectsText}`

        return textLog;
    }

    public getFPS(): number {
        return this.fps;
    }

    public getFrameCount(): number {
        return this.frameCount;
    }

    protected startFPS(): void {
        if(this.fpsInstance){
            this.fpsInstance.destroy();
        }

        if(!this.logs) return;

        this.fpsInstance = new Text2D({
            text: this.getTextLog(),
            position: { x: 20, y: 20 },
            rotation: 0,
            width: "auto",
            height: "auto",
            fontSize: "20px",
            fontWeight: "bold",
            fontFamily: "Arial",
            color: "white",
            background: "rgba(255, 0, 0, 0.2)",
            borderColor: "red",
            borderSize: 2,
            borderRadius: 5,
            lineJoin: "miter",
            lineCap: "butt",
            shadowColor: "rgba(255, 0, 0, 1)",
            shadowBlur: 30,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            paddingTop: 10,
            paddingRight: 10,
            paddingBottom: 10,
            paddingLeft: 10,
            spacingY: 10,
            spacingX: 0,
            textAlign: "left",
            textBaseline: "top",
            textDirection: "ltr",
            layer: 100000,
        })
    }

    protected updateFPS(now: number): void {
        if(!this.logs) return;

        this.frameCount++;
        const delta = now - this.lastTime;

        if(delta >= 1000){
            this.fps = Math.round(this.frameCount * 1000 / delta);
            this.frameCount = 0;
            this.lastTime = now;
        }

        this.fpsInstance!.setText(this.getTextLog());
        
        this.fpsInstance?.set("background", "rgba(0, 255, 0, 0.2)");
        this.fpsInstance?.set("shadowColor", "rgba(0, 255, 0, 1)");
        this.fpsInstance?.set("borderColor", "green");

        if(this.fps < 30){
            this.fpsInstance?.set("background", "rgba(255, 0, 0, 0.5)");
            this.fpsInstance?.set("shadowColor", "rgba(255, 0, 0, 1)");
            this.fpsInstance?.set("borderColor", "red");
        }

        if(this.fps >= 30 && this.fps <= 50){
            this.fpsInstance?.set("background", "rgba(255, 165, 0, 0.5)");
            this.fpsInstance?.set("shadowColor", "rgba(255, 165, 0, 1)");
            this.fpsInstance?.set("borderColor", "orange");
        }
    }
}

export { FPS }