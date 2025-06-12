
export interface OriginalImageType {
  dataUrl: string;
  width: number;
  height: number;
}

export interface CanvasEditorHandles {
  exportAsDataURL: () => string;
  clearDrawing: () => void;
}
