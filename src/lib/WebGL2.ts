import { Quality } from "./Types/Global";
import { Creator } from "./Common/Creator";
import { Render2D } from "./Renders/Render2D";
import { RenderGL } from "./Renders/RenderGL";

interface Config {
    quality?: Quality;
    logs?: boolean;
}

class WebGL2 extends Creator {
    public static instance: WebGL2;

    public renderGL: RenderGL;

    private renderId: number | null = null;
    private lastRenderTime: number = 0;
    private umbralTime: number = 16;
    private quality: Quality = "low";

    private boundRender = (time: number) => this.render(time);

    constructor(canvasRender: HTMLCanvasElement, canvasDraw: HTMLCanvasElement) {
        const render2D =  new Render2D(canvasDraw);
        super(render2D);
        this.renderGL = new RenderGL(canvasRender);
    }

    public static getInstance(canvasRender?: HTMLCanvasElement, canvasDraw?: HTMLCanvasElement): WebGL2 {
        if(!WebGL2.instance && canvasRender && canvasDraw) {
            WebGL2.instance = new WebGL2(canvasRender, canvasDraw);
        }

        return WebGL2.instance;
    }

    public getQuality(): Quality {
        return this.quality;
    }

    public setQuality(quality: Quality): void {
        this.quality = quality;
    }

    public setConfig(config: Config): void {
        this.quality = config.quality != undefined ? config.quality : this.quality;
        this.logs = config.logs != undefined ? config.logs : this.logs;

        this.stop();
        this.start();
    }

    public getConfig(): Config {
        const payload: Config = {
            quality: this.quality,
            logs: this.logs
        }

        return payload;
    }

    public start(): void {
        if(this.renderId) {
            return;
        }

        this.lastTime = performance.now();
        this.renderId = requestAnimationFrame(this.boundRender);
        this.lastRenderTime = performance.now() - this.umbralTime;

        this.config();
        this.startFPS();
        this.Render2D.start();
    }

    public stop(): void {
        if(!this.renderId) {
            return;
        }

        this.frameCount = 0;
        this.fps = 0;
        this.lastTime = 0;
        cancelAnimationFrame(this.renderId);
        this.renderId = null;
    }

    private config(): void {
        const quality: Quality = this.quality;

        switch (quality) {
            case "low":
                this.umbralTime = 24;
                break;
            case "medium":
                this.umbralTime = 16;
                break;
            case "high":
                this.umbralTime = 16;
                break;
        }
    }

    private render(now: number): void {
        this.updateFPS(now);

        const delta = now - this.lastRenderTime;

        if(delta >= this.umbralTime){
            this.renderGL.render(now);
            this.Render2D.render(now);
            
            this.lastRenderTime = now;
        }

        if(this.renderId) {
            this.renderId = requestAnimationFrame(this.boundRender);
        }
    }
}

export { WebGL2 };