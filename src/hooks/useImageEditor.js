import { useState, useCallback, useRef } from 'react';
import * as fabric from 'fabric';

/**
 * Custom hook for managing a Fabric.js canvas for image editing.
 * Provides tools for drawing, shapes, text, and manipulation.
 */
export function useImageEditor() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [activeTool, setActiveTool] = useState('select');
  const [activeObject, setActiveObject] = useState(null);
  const [fillColor, setFillColor] = useState('#000000');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [brushSize, setBrushSize] = useState(5);
  const [fontSize, setFontSize] = useState(24);

  const initializeCanvas = useCallback((containerEl, width, height) => {
    const fabricCanvas = new fabric.Canvas(containerEl, {
      width,
      height,
      selection: true,
      preserveObjectStacking: true,
    });

    fabricCanvas.on('selection:created', (e) => setActiveObject(e.selected[0]));
    fabricCanvas.on('selection:updated', (e) => setActiveObject(e.selected[0]));
    fabricCanvas.on('selection:cleared', () => setActiveObject(null));

    setCanvas(fabricCanvas);
    return fabricCanvas;
  }, []);

  const loadSVG = useCallback(
    async (svgString) => {
      if (!canvas) return;
      canvas.clear();

      return new Promise((resolve) => {
        fabric.loadSVGFromString(svgString, (objects, options) => {
          const group = fabric.util.groupSVGElements(objects, options);
          canvas.add(group);
          canvas.centerObject(group);
          canvas.renderAll();
          resolve(group);
        });
      });
    },
    [canvas]
  );

  const setTool = useCallback(
    (tool) => {
      if (!canvas) return;
      setActiveTool(tool);

      // Configure canvas based on tool
      switch (tool) {
        case 'select':
          canvas.isDrawingMode = false;
          canvas.selection = true;
          break;
        case 'brush':
          canvas.isDrawingMode = true;
          canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
          canvas.freeDrawingBrush.color = strokeColor;
          canvas.freeDrawingBrush.width = brushSize;
          break;
        case 'text':
        case 'rect':
        case 'circle':
        case 'line':
        case 'arrow':
          canvas.isDrawingMode = false;
          canvas.selection = false;
          break;
        default:
          break;
      }
    },
    [canvas, strokeColor, brushSize]
  );

  const addShape = useCallback(
    (type) => {
      if (!canvas) return;

      let shape;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      switch (type) {
        case 'rect':
          shape = new fabric.Rect({
            left: centerX - 50,
            top: centerY - 50,
            width: 100,
            height: 100,
            fill: fillColor,
            stroke: strokeColor,
            strokeWidth,
          });
          break;
        case 'circle':
          shape = new fabric.Circle({
            left: centerX - 50,
            top: centerY - 50,
            radius: 50,
            fill: fillColor,
            stroke: strokeColor,
            strokeWidth,
          });
          break;
        case 'line':
          shape = new fabric.Line([centerX - 50, centerY, centerX + 50, centerY], {
            stroke: strokeColor,
            strokeWidth,
          });
          break;
        case 'arrow':
          // Arrow is a group of line + triangle
          const line = new fabric.Line([0, 0, 100, 0], {
            stroke: strokeColor,
            strokeWidth,
          });
          const triangle = new fabric.Triangle({
            left: 90,
            top: -10,
            width: 20,
            height: 20,
            fill: strokeColor,
            angle: 90,
          });
          shape = new fabric.Group([line, triangle], {
            left: centerX - 50,
            top: centerY,
          });
          break;
        default:
          return;
      }

      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.renderAll();
    },
    [canvas, fillColor, strokeColor, strokeWidth]
  );

  const addText = useCallback(
    (text = 'Double-click to edit') => {
      if (!canvas) return;

      const textObj = new fabric.IText(text, {
        left: canvas.width / 2 - 100,
        top: canvas.height / 2,
        fontSize,
        fill: fillColor,
        fontFamily: 'Inter, sans-serif',
      });

      canvas.add(textObj);
      canvas.setActiveObject(textObj);
      canvas.renderAll();
    },
    [canvas, fontSize, fillColor]
  );

  const exportToSVG = useCallback(() => {
    if (!canvas) return '';
    return canvas.toSVG();
  }, [canvas]);

  const exportToPNG = useCallback(async () => {
    if (!canvas) return null;
    return canvas.toDataURL({ format: 'png', multiplier: 2 });
  }, [canvas]);

  const deleteSelected = useCallback(() => {
    if (!canvas || !activeObject) return;
    canvas.remove(activeObject);
    canvas.renderAll();
    setActiveObject(null);
  }, [canvas, activeObject]);

  const bringToFront = useCallback(() => {
    if (!canvas || !activeObject) return;
    canvas.bringToFront(activeObject);
    canvas.renderAll();
  }, [canvas, activeObject]);

  const sendToBack = useCallback(() => {
    if (!canvas || !activeObject) return;
    canvas.sendToBack(activeObject);
    canvas.renderAll();
  }, [canvas, activeObject]);

  return {
    canvasRef,
    canvas,
    initializeCanvas,
    loadSVG,
    activeTool,
    setTool,
    activeObject,
    fillColor,
    setFillColor,
    strokeColor,
    setStrokeColor,
    strokeWidth,
    setStrokeWidth,
    brushSize,
    setBrushSize,
    fontSize,
    setFontSize,
    addShape,
    addText,
    exportToSVG,
    exportToPNG,
    deleteSelected,
    bringToFront,
    sendToBack,
  };
}
