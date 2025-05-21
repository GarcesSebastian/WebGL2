import { Rect2D } from "../Shapes/Rect2D"
import { Text2D } from "../Shapes/Text2D"
import { Rect2D as Rect2DProps } from "../Types/Shapes";
import { Text2D as Text2DProps } from "../Types/Shapes";
import { FPS } from "../Controllers/fps.controller";
import { Render2D } from "../Renders/Render2D";
import { Transformer } from "../Utils/Transformer";
import { CacheManager } from "../Utils/CacheManager";

class Creator extends FPS {
    constructor(Render2D: Render2D){
        super(Render2D);
    }
    public createText2D(data: Text2DProps): Text2D {
        const newText2D = new Text2D(data);
        this.Render2D.childrens.set(newText2D.getId(), newText2D);
        CacheManager.addChild(newText2D);

        return newText2D;
    }

    public createRect2D(data: Rect2DProps): Rect2D {
        const newRect2D = new Rect2D(data);
        this.Render2D.childrens.set(newRect2D.getId(), newRect2D);
        CacheManager.addChild(newRect2D);
        
        return newRect2D;
    }

    public createTransformer2D(): Transformer {
        return new Transformer();
    }
}

export { Creator }