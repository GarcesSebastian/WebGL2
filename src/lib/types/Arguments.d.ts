import { Shape2D } from "./Shapes";

export type PointerPosition = {
  x: number;
  y: number;
};

export type ShapeClickEvent = PointerPosition & {
  target: Shape2D;
};

export type ShapeDragEvent = PointerPosition & {
  target: Shape2D;
};

export type EventsMap = {
  click: ShapeClickEvent;
  dragstart: ShapeDragEvent;
  dragmove: ShapeDragEvent;
  dragend: ShapeDragEvent;
};
