class RenderGL {
    public canvas: HTMLCanvasElement;
    public gl: WebGL2RenderingContext;

    constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl2")!;
    }

    public render(now: number): void {}
}

export { RenderGL };