export type Dimension = number | "auto";
export type Vector2D = { x: number; y: number };
export type PaddingVector = { top?: number; right?: number; bottom?: number; left?: number };
export type PaddingX = { left: number; right: number };
export type PaddingY = { top: number; bottom: number };
export type FontFamily =
  | "Arial"
  | "Helvetica"
  | "Times New Roman"
  | "Courier New"
  | "Verdana"
  | "Georgia"
  | "Palatino"
  | "Garamond"
  | "Comic Sans MS"
  | "Trebuchet MS"
  | "Arial Black"
  | "Impact"
  | "serif"
  | "sans-serif"
  | "monospace"
  | "cursive"
  | "fantasy"
  | "system-ui"
  | "ui-serif"
  | "ui-sans-serif"
  | "ui-monospace"
  | "emoji"
  | "math"
  | "fangsong";
export type FontSize = `${number}px`;
export type FontWeight =
  | "normal"
  | "bold"
  | "bolder"
  | "lighter"
  | `${number}`;
export type FontStyle = "normal" | "italic" | "oblique";
export type FontVariant = "normal" | "small-caps";
export type TextAlign = "start" | "end" | "left" | "right" | "center";
export type TextBaseline = "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom";
export type TextDirection = "ltr" | "rtl" | "inherit";

export type Quality = "low" | "medium" | "high";