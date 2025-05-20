import { Rect2D } from "../Shapes/Rect2D"
import { Text2D } from "../Shapes/Text2D"
import { Rect2D as Rect2DProps } from "../types/Shapes";
import { Text2D as Text2DProps } from "../types/Shapes";
import { FPS } from "../Controllers/fps.controller";
import { Render2D } from "../Renders/Render2D";
import { Transformer } from "../Utils/Transformer";

class Creator extends FPS {
    constructor(Render2D: Render2D){
        super(Render2D);
    }
    public createText2D(data: Text2DProps): Text2D {
        return new Text2D(data);
    }

    public createRect2D(data: Rect2DProps): Rect2D {
        return new Rect2D(data);
    }

    public createTransformer2D(): Transformer {
        return new Transformer();
    }
}

export { Creator }