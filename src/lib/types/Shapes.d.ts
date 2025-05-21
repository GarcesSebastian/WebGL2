import { TextAlign } from "chart.js"
import { Text2D as Text2DInstance } from "../Shapes/Text2D"
import { Vector2D, Dimension, FontFamily, FontSize, FontWeight, FontStyle, FontVariant, TextBaseline, TextDirection } from "./Global"

interface Paddings {
    paddingTop?: number,
    paddingRight?: number,
    paddingBottom?: number,
    paddingLeft?: number
}

interface Styles {
    color?: string,
    borderRadius?: number,
    background?: string
    borderColor?: string,
    borderSize?: number
}

interface Dimensions {
    position?: Vector2D,
    velocity?: Vector2D;
    rotation?: number;
    width?: Dimension,
    height?: Dimension,
    radius?: number
}

interface States {
    ignorable?: boolean;
    visible?: boolean;
    collisionable?: boolean;
    draggable?: boolean;
    physics?: boolean;
}

export interface Shape2D extends Paddings, Styles, Dimensions, States {
    lineJoin?: CanvasLineJoin;
    lineCap?: CanvasLineCap;
    shadowColor?: string;
    shadowBlur?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
    layer?: number;
}

export interface Text2D extends Shape2D {
    text: string,
    fontFamily?: FontFamily;
    fontSize?: FontSize;
    fontWeight?: FontWeight;
    fontStyle?: FontStyle;
    fontVariant?: FontVariant;
    textAlign?: TextAlign;
    textBaseline?: TextBaseline;
    textDirection?: TextDirection;
    spacingY?: number,
    spacingX?: number,
    onLoaded?: (instance: Text2DInstance) => void;
}

export interface ElementShape extends Shape2D {
    id: string;
}

export interface Rect2D extends Shape2D {}
