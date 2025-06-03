export type Player = {
  id: string;
  position: string;
  x: number;
  y: number;
  color: string;
};

export type DrawingLine = {
  id: string;
  points: number[];
  color: string;
  tool: string;
};
