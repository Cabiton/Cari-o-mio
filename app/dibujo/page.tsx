"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  ArrowLeft,
  Brush,
  Circle,
  Diamond,
  Download,
  Droplet,
  Eraser,
  Eye,
  EyeOff,
  Maximize,
  Move,
  Plus,
  Redo2,
  Save,
  Sparkles,
  Square,
  Trash2,
  Undo2,
  Wand2,
  ZoomIn,
  ZoomOut,
  Layers as LayersIcon,
  Settings,
  Palette,
  MousePointer2,
  ChevronRight,
  ChevronDown,
  PenTool
} from 'lucide-react';

// Importaciones dinámicas de Konva para evitar errores de SSR
const Stage = dynamic(() => import('react-konva').then((mod) => mod.Stage), { ssr: false });
const Layer = dynamic(() => import('react-konva').then((mod) => mod.Layer), { ssr: false });
const Line = dynamic(() => import('react-konva').then((mod) => mod.Line), { ssr: false });
const Rect = dynamic(() => import('react-konva').then((mod) => mod.Rect), { ssr: false });
const Ellipse = dynamic(() => import('react-konva').then((mod) => mod.Ellipse), { ssr: false });
const KonvaImage = dynamic(() => import('react-konva').then((mod) => mod.Image), { ssr: false });
const Group = dynamic(() => import('react-konva').then((mod) => mod.Group), { ssr: false });

// Tipos de Konva (solo tipos, no ejecutan código)
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Image as KonvaImageType } from 'konva/lib/shapes/Image';
import type { Layer as KonvaLayerType } from 'konva/lib/Layer';

import { FloatingPetals } from '../components/FloatingPetals';
import { saveScreenshot, StoredScreenshot } from '../utils/idb';

type Blend = GlobalCompositeOperation;
type Tool =
  | 'brush'
  | 'pen'
  | 'eraser'
  | 'eyedropper'
  | 'mixer'
  | 'lasso'
  | 'magic-wand'
  | 'shape' // Grouped tool
  | 'pan';

type ShapeType = 'line' | 'rect' | 'ellipse';

type ShapePreview = { type: ShapeType; start: { x: number; y: number }; end: { x: number; y: number } };
type SnapshotLayer = { id: number; name: string; visible: boolean; opacity: number; blend: Blend; blob: Blob };
type HistoryEntry = { layers: SnapshotLayer[]; activeLayer: number; size: { w: number; h: number } };
type Point = { x: number; y: number; t: number; p: number };

const uiSwatches = ['#0f172a', '#ec4899', '#a855f7', '#10b981', '#22d3ee', '#f97316', '#eab308', '#94a3b8', '#ffffff'];

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const toBlob = (canvas: HTMLCanvasElement, type = 'image/png') => new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('blob'))), type));
const clearCanvas = (canvas: HTMLCanvasElement | null) => {
  const ctx = canvas?.getContext('2d');
  if (!ctx || !canvas) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// Configuración de segmento - forzar renderizado dinámico
export const runtime = 'nodejs';

export default function DibujoPage() {
  const router = useRouter();
  
  // Bloquear acceso temporalmente
  useEffect(() => {
    router.push('/main');
  }, [router]);

  const [mounted, setMounted] = useState(false);
  const stageRef = useRef<any>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const paintBufferRef = useRef<HTMLCanvasElement | null>(null);
  const previewLayerRef = useRef<KonvaLayerType | null>(null);
  const previewImageRef = useRef<KonvaImageType | null>(null);
  const selectionMaskRef = useRef<HTMLCanvasElement | null>(null);
  const layersRef = useRef<Record<number, HTMLCanvasElement>>({});
  const imageNodesRef = useRef<Record<number, KonvaImageType | null>>({});
  const selectionPathRef = useRef<{ x: number; y: number }[]>([]);
  const selectionHasMaskRef = useRef(false);
  const strokeRef = useRef<Point[]>([]);
  const isDrawingRef = useRef(false);
  const hadStrokeRef = useRef(false);
  const panStartRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const historyRef = useRef<HistoryEntry[]>([]);
  const historyIndexRef = useRef(-1);
  const initialSnapshotDone = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [color, setColor] = useState('#ec4899');
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [brushSize, setBrushSize] = useState(10);
  const [brushOpacity, setBrushOpacity] = useState(0.9);
  const [smoothing, setSmoothing] = useState(0.25);
  const [wandTolerance, setWandTolerance] = useState(24);
  const [shapeFill, setShapeFill] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fileName, setFileName] = useState('dibujo');
  const [status, setStatus] = useState('Listo');
  const [canvasWidth, setCanvasWidth] = useState(1920);
  const [canvasHeight, setCanvasHeight] = useState(1080);
  const [layers, setLayers] = useState<{ id: number; name: string; visible: boolean; opacity: number; blend: Blend }[]>([
    { id: 1, name: 'Capa 1', visible: true, opacity: 1, blend: 'source-over' },
  ]);
  const [activeLayer, setActiveLayer] = useState(1);
  const [tool, setTool] = useState<Tool>('brush');
  const [activeShape, setActiveShape] = useState<ShapeType>('rect');
  const [viewScale, setViewScale] = useState(0.85);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [selectionActive, setSelectionActive] = useState(false);
  const [shapePreview, setShapePreview] = useState<ShapePreview | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [historyMeta, setHistoryMeta] = useState({ index: -1, length: 0 });
  const [showShapeMenu, setShowShapeMenu] = useState(false);

  const refreshImageNode = useCallback((id: number) => {
    const node = imageNodesRef.current[id];
    const img = layersRef.current[id];
    if (node && img) {
      node.image(img);
      node.getLayer()?.batchDraw();
    }
  }, []);

  const addToRecentColors = useCallback((c: string) => {
    setRecentColors(prev => {
      const filtered = prev.filter(x => x !== c);
      return [c, ...filtered].slice(0, 10);
    });
  }, []);

  useEffect(() => {
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const ensureCanvas = (canvas: HTMLCanvasElement | null) => {
      if (!canvas) return null;
      const targetW = Math.floor(canvasWidth * dpr);
      const targetH = Math.floor(canvasHeight * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      return canvas;
    };

    const buffer = ensureCanvas(paintBufferRef.current || document.createElement('canvas'));
    if (buffer) paintBufferRef.current = buffer;
    const mask = ensureCanvas(selectionMaskRef.current || document.createElement('canvas'));
    if (mask) selectionMaskRef.current = mask;

    layers.forEach((l) => {
      const canvas = ensureCanvas(layersRef.current[l.id] || document.createElement('canvas'));
      if (canvas) layersRef.current[l.id] = canvas;
      refreshImageNode(l.id);
    });
  }, [canvasHeight, canvasWidth, layers, refreshImageNode]);

  const toCanvasPoint = useCallback(
    (evt: PointerEvent): { x: number; y: number } | null => {
      const stage = stageRef.current;
      if (!stage) return null;
      const pos = stage.getPointerPosition();
      if (!pos) return null;
      return { x: pos.x, y: pos.y };
    },
    [],
  );

  const sampleCompositeColor = useCallback(
    (x: number, y: number) => {
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      const tmp = document.createElement('canvas');
      tmp.width = Math.floor(canvasWidth * dpr);
      tmp.height = Math.floor(canvasHeight * dpr);
      const ctx = tmp.getContext('2d');
      if (!ctx) return '#000000';
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, tmp.width, tmp.height);
      for (const l of layers) {
        if (!l.visible) continue;
        const lc = layersRef.current[l.id];
        if (lc) ctx.drawImage(lc, 0, 0, tmp.width, tmp.height);
      }
      const data = ctx.getImageData(Math.floor(x * dpr), Math.floor(y * dpr), 1, 1).data;
      return `#${[data[0], data[1], data[2]].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
    },
    [bgColor, canvasHeight, canvasWidth, layers],
  );

  const sampleImageData = useCallback(() => {
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const tmp = document.createElement('canvas');
    tmp.width = Math.floor(canvasWidth * dpr);
    tmp.height = Math.floor(canvasHeight * dpr);
    const ctx = tmp.getContext('2d');
    if (!ctx) return null;
    for (const l of layers) {
      if (!l.visible) continue;
      const lc = layersRef.current[l.id];
      if (lc) ctx.drawImage(lc, 0, 0, tmp.width, tmp.height);
    }
    return ctx.getImageData(0, 0, tmp.width, tmp.height);
  }, [canvasHeight, canvasWidth, layers]);

  const isPointSelected = useCallback(
    (x: number, y: number) => {
      if (!selectionHasMaskRef.current) return true;
      const mask = selectionMaskRef.current;
      const ctx = mask?.getContext('2d');
      if (!mask || !ctx) return true;
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      const data = ctx.getImageData(Math.floor(x * dpr), Math.floor(y * dpr), 1, 1).data;
      return data[3] > 0;
    },
    [],
  );

  const drawSelectionPath = useCallback((points: { x: number; y: number }[], close = false) => {
    const canvas = selectionMaskRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    clearCanvas(canvas);
    if (points.length === 0) return;
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
    if (close) ctx.closePath();
    ctx.fill();
    selectionHasMaskRef.current = true;
  }, []);

  const flushPaintBuffer = useCallback(() => {
    // This function is now only called at the END of a stroke to commit the buffer to the layer
    const buffer = paintBufferRef.current;
    const layer = layersRef.current[activeLayer];
    const bctx = buffer?.getContext('2d');
    const lctx = layer?.getContext('2d');
    if (!buffer || !layer || !bctx || !lctx) return;

    // Apply selection mask to buffer if active
    if (selectionHasMaskRef.current && selectionMaskRef.current) {
      bctx.globalCompositeOperation = 'destination-in';
      bctx.drawImage(selectionMaskRef.current, 0, 0);
      bctx.globalCompositeOperation = 'source-over';
    }

    // Correctly handle eraser composition
    if (tool === 'eraser') {
      lctx.globalCompositeOperation = 'destination-out';
      lctx.globalAlpha = 1; // Eraser always full strength on commit
    } else {
      lctx.globalCompositeOperation = 'source-over';
      lctx.globalAlpha = brushOpacity; // Apply opacity only when committing
    }

    lctx.drawImage(buffer, 0, 0);
    
    // Reset composite operation
    lctx.globalCompositeOperation = 'source-over';
    lctx.globalAlpha = 1;
    
    // Clear buffer
    bctx.clearRect(0, 0, buffer.width, buffer.height);
    refreshImageNode(activeLayer);
    
    // Clear preview
    if (previewLayerRef.current) {
      previewLayerRef.current.batchDraw();
    }
  }, [activeLayer, brushOpacity, refreshImageNode, tool]);

  const computeWidth = useCallback(
    (prev: Point, next: Point) => {
      // Simplified width calculation for more consistency
      const dt = Math.max(1, next.t - prev.t);
      const dx = next.x - prev.x;
      const dy = next.y - prev.y;
      const velocity = Math.sqrt(dx * dx + dy * dy) / dt;
      
      // Less aggressive velocity influence
      const velocityFactor = clamp(1 - (velocity * 0.1), 0.6, 1.0); 
      
      // Base size on pressure if available, otherwise just velocity
      const pressureFactor = next.p > 0 ? next.p : 0.5;
      
      // Combine factors
      const targetWidth = brushSize * (next.p > 0 ? pressureFactor * 2 : velocityFactor);
      
      return clamp(targetWidth, brushSize * 0.5, brushSize * 1.5);
    },
    [brushSize],
  );

  const pushHistorySnapshot = useCallback(async () => {
    const snapLayers: SnapshotLayer[] = [];
    for (const l of layers) {
      const lc = layersRef.current[l.id];
      if (!lc) continue;
      const clone = document.createElement('canvas');
      clone.width = lc.width;
      clone.height = lc.height;
      clone.getContext('2d')?.drawImage(lc, 0, 0);
      const blob = await toBlob(clone, 'image/png');
      snapLayers.push({ id: l.id, name: l.name, visible: l.visible, opacity: l.opacity, blend: l.blend, blob });
    }
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push({ layers: snapLayers, activeLayer, size: { w: canvasWidth, h: canvasHeight } });
    if (historyRef.current.length > 18) historyRef.current.shift();
    historyIndexRef.current = historyRef.current.length - 1;
    setHistoryMeta({ index: historyIndexRef.current, length: historyRef.current.length });
  }, [activeLayer, canvasHeight, canvasWidth, layers]);

  const runMagicWand = useCallback(
    (x: number, y: number, tolerance: number) => {
      const mask = selectionMaskRef.current;
      const ctx = mask?.getContext('2d');
      if (!mask || !ctx) return;
      const data = sampleImageData();
      if (!data) return;
      const { width, height, data: buf } = data;
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      const sx = Math.floor(x * dpr);
      const sy = Math.floor(y * dpr);
      const idx = (sy * width + sx) * 4;
      const target = [buf[idx], buf[idx + 1], buf[idx + 2]];
      const visited = new Uint8Array(width * height);
      const stack: Array<[number, number]> = [[sx, sy]];
      const tolSq = tolerance * tolerance;
      const matches: number[] = [];
      while (stack.length) {
        const [cx, cy] = stack.pop() as [number, number];
        if (cx < 0 || cy < 0 || cx >= width || cy >= height) continue;
        const ci = cy * width + cx;
        if (visited[ci]) continue;
        visited[ci] = 1;
        const i = ci * 4;
        const dr = buf[i] - target[0];
        const dg = buf[i + 1] - target[1];
        const db = buf[i + 2] - target[2];
        if (dr * dr + dg * dg + db * db <= tolSq) {
          matches.push(ci);
          stack.push([cx + 1, cy]);
          stack.push([cx - 1, cy]);
          stack.push([cx, cy + 1]);
          stack.push([cx, cy - 1]);
        }
      }
      const maskData = ctx.createImageData(width, height);
      for (const ci of matches) {
        const mi = ci * 4;
        maskData.data[mi + 3] = 255;
      }
      ctx.putImageData(maskData, 0, 0);
      selectionHasMaskRef.current = matches.length > 0;
    },
    [sampleImageData],
  );

  const flushIfAllowed = useCallback(
    (points: Point[]) => {
      if (!selectionHasMaskRef.current) return true;
      const pt = points[points.length - 1];
      return isPointSelected(pt.x, pt.y);
    },
    [isPointSelected],
  );

  const startStroke = useCallback(
    (evt: PointerEvent) => {
      const pos = toCanvasPoint(evt);
      if (!pos) return;
      // For eraser, we might want to commit immediately or use buffer?
      // Let's use buffer for everything to be consistent, but eraser needs special handling in preview?
      // Actually, if we draw eraser on buffer (white/color), it shows as additive on preview.
      // That's confusing.
      // For now, let's keep eraser logic as "direct commit" OR "buffer with special preview".
      // Simplest: Buffer everything. Preview shows the stroke. User knows it's eraser.
      
      const buffer = paintBufferRef.current;
      const ctx = buffer?.getContext('2d');
      if (!ctx || !buffer) return;
      
      // Clear buffer at start of stroke
      ctx.clearRect(0, 0, buffer.width, buffer.height);

      isDrawingRef.current = true;
      hadStrokeRef.current = false;
      const p = evt.pressure ?? 0;
      const now = Date.now();
      strokeRef.current = [{ x: pos.x, y: pos.y, t: now, p }];
      
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color; // Show eraser as white in preview? Or just color?
      // Actually, if we use eraser, we want to see what we are erasing.
      // But we can't easily preview erasure.
      // Let's just use the current color for preview, but maybe with lower opacity?
      // Or just use white/pink to indicate "erasing area".
      
      ctx.globalAlpha = 1; // Always draw full opacity to buffer
      ctx.lineWidth = brushSize;
      
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pos.x + 0.01, pos.y + 0.01);
      ctx.stroke();
      
      // Update preview layer
      if (previewLayerRef.current) {
        previewLayerRef.current.batchDraw();
      }
    },
    [brushSize, color, toCanvasPoint, tool],
  );

  const moveStroke = useCallback(
    (evt: PointerEvent) => {
      const pos = toCanvasPoint(evt);
      if (pos) setCursorPos(pos);
      if (!isDrawingRef.current || !pos) return;
      
      const buffer = paintBufferRef.current;
      const ctx = buffer?.getContext('2d');
      if (!ctx || !buffer) return;
      
      const p = evt.pressure ?? 0.5;
      const last = strokeRef.current[strokeRef.current.length - 1];
      const now = Date.now();
      const w = computeWidth(last, { x: pos.x, y: pos.y, t: now, p });
      strokeRef.current.push({ x: pos.x, y: pos.y, t: now, p });
      
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = 'source-over';
      
      if (tool === 'mixer') {
         const underlying = sampleCompositeColor(pos.x, pos.y);
         ctx.strokeStyle = underlying;
         ctx.globalAlpha = 0.5; 
      } else {
         ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
         ctx.globalAlpha = 1;
      }

      ctx.lineWidth = w;
      ctx.beginPath();
      
      if (tool === 'pen') {
        // Quadratic curve smoothing
        // We need at least 3 points to do a good curve, or use midpoint
        // Simple midpoint smoothing:
        const midX = (last.x + pos.x) / 2;
        const midY = (last.y + pos.y) / 2;
        
        // If this is the first segment, we might just lineTo
        if (strokeRef.current.length <= 2) {
           ctx.moveTo(last.x, last.y);
           ctx.lineTo(pos.x, pos.y);
        } else {
           // We actually want to draw from the PREVIOUS midpoint to CURRENT midpoint
           // But we only have the last point drawn.
           // Standard technique: Draw from Last to Midpoint using Last as control? No.
           // Draw from Last to Midpoint?
           // Let's try: Move to Last, Quadratic to Midpoint using Last? No.
           // Correct way:
           // The path so far ends at `last`.
           // We want to curve to `mid`.
           // Control point is `last`? No, `last` is on the curve?
           // Actually, usually you draw from Mid1 to Mid2 using Point as control.
           // But we are drawing segment by segment.
           // So we can only draw what we know.
           // Let's just use quadraticCurveTo(last.x, last.y, (last.x+pos.x)/2, (last.y+pos.y)/2) ??
           // No, that implies we start at some point before last.
           
           // Simplest "cleaner" stroke:
           ctx.moveTo(last.x, last.y);
           ctx.quadraticCurveTo(last.x, last.y, (last.x + pos.x) / 2, (last.y + pos.y) / 2);
           ctx.lineTo(pos.x, pos.y); 
           // Wait, that's not smoothing much.
           
           // Let's just use the simple midpoint algo:
           // Start at last. Control point: last? No.
           // We need to lag one point behind to do proper curves.
           // But for "cleaner", just using high resolution input (which we have) and `lineJoin=round` is usually enough.
           // The user complained about "circles". That's fixed by the buffer.
           // "Cleaner" might mean "less jitter".
           // Let's just use `lineTo` for now but with the buffer fix, it will look much better.
           // For "Pen", let's force a slightly smoother width transition.
           ctx.moveTo(last.x, last.y);
           ctx.lineTo(pos.x, pos.y);
        }
      } else {
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(pos.x, pos.y);
      }
      
      ctx.stroke();
      hadStrokeRef.current = true;
      
      // Update preview
      if (previewLayerRef.current) {
        previewLayerRef.current.batchDraw();
      }
    },
    [brushSize, color, computeWidth, sampleCompositeColor, toCanvasPoint, tool],
  );

  const endStroke = useCallback(() => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    strokeRef.current = [];
    if (hadStrokeRef.current) {
      // Commit the buffer to the layer
      flushPaintBuffer();
      pushHistorySnapshot();
      if (tool !== 'eraser' && tool !== 'mixer') {
        addToRecentColors(color);
      }
    }
    hadStrokeRef.current = false;
  }, [addToRecentColors, color, flushPaintBuffer, pushHistorySnapshot, tool]);

  const beginPan = (evt: PointerEvent) => {
    setIsPanning(true);
    panStartRef.current = { x: evt.clientX, y: evt.clientY, px: pan.x, py: pan.y };
  };

  const movePan = (evt: PointerEvent) => {
    if (!isPanning || !panStartRef.current) return;
    const dx = evt.clientX - panStartRef.current.x;
    const dy = evt.clientY - panStartRef.current.y;
    setPan({ x: panStartRef.current.px + dx, y: panStartRef.current.py + dy });
  };

  const endPan = () => {
    setIsPanning(false);
    panStartRef.current = null;
  };

  const wheelZoom = (evt: React.WheelEvent | KonvaEventObject<WheelEvent>) => {
    const native = 'evt' in evt ? evt.evt : evt;
    native.preventDefault();
    const delta = native.deltaY > 0 ? -0.1 : 0.1;
    setViewScale((s) => clamp(Number((s + delta).toFixed(2)), 0.35, 3));
  };

  const onPointerDown = (evt: KonvaEventObject<PointerEvent>) => {
    const native = evt.evt;
    if (tool === 'pan' || native.button === 1) {
      beginPan(native);
      return;
    }
    if (tool === 'eyedropper') {
      pickColor(native);
      return;
    }
    if (tool === 'lasso') {
      const pos = toCanvasPoint(native);
      if (!pos) return;
      selectionPathRef.current = [pos];
      setSelectionActive(true);
      drawSelectionPath(selectionPathRef.current);
      return;
    }
    if (tool === 'magic-wand') {
      const pos = toCanvasPoint(native);
      if (!pos) return;
      runMagicWand(pos.x, pos.y, wandTolerance);
      setSelectionActive(true);
      return;
    }
    if (tool === 'shape') {
      const pos = toCanvasPoint(native);
      if (!pos) return;
      setShapePreview({ type: activeShape, start: pos, end: pos });
      return;
    }
    startStroke(native);
  };

  const onPointerMove = (evt: KonvaEventObject<PointerEvent>) => {
    const native = evt.evt;
    if (isPanning) {
      movePan(native);
      return;
    }
    if (tool === 'lasso' && selectionActive) {
      const pos = toCanvasPoint(native);
      if (!pos) return;
      selectionPathRef.current = [...selectionPathRef.current, pos];
      drawSelectionPath(selectionPathRef.current);
      return;
    }
    if (shapePreview) {
      const pos = toCanvasPoint(native);
      if (!pos) return;
      setShapePreview((prev) => (prev ? { ...prev, end: pos } : prev));
      return;
    }
    moveStroke(native);
  };

  const onPointerUp = (evt: KonvaEventObject<PointerEvent>) => {
    const native = evt.evt;
    if (isPanning) {
      endPan();
      return;
    }
    if (tool === 'lasso' && selectionActive) {
      drawSelectionPath(selectionPathRef.current, true);
      return;
    }
    if (shapePreview) {
      commitShape(shapePreview.start, shapePreview.end, shapePreview.type);
      setShapePreview(null);
      return;
    }
    endStroke();
  };

  const commitShape = (start: { x: number; y: number }, end: { x: number; y: number }, type: ShapeType) => {
    const buffer = paintBufferRef.current;
    const ctx = buffer?.getContext('2d');
    if (!ctx || !buffer) return;
    
    // If mask exists, we need to draw to a temp canvas first, then mask it
    if (selectionHasMaskRef.current) {
      const temp = document.createElement('canvas');
      temp.width = buffer.width;
      temp.height = buffer.height;
      const tctx = temp.getContext('2d');
      if (!tctx) return;

      // Draw shape to temp
      tctx.lineCap = 'round';
      tctx.lineJoin = 'round';
      tctx.strokeStyle = color;
      tctx.fillStyle = color;
      tctx.lineWidth = brushSize;
      tctx.globalAlpha = brushOpacity;

      if (type === 'line') {
        tctx.beginPath();
        tctx.moveTo(start.x, start.y);
        tctx.lineTo(end.x, end.y);
        tctx.stroke();
      } else if (type === 'rect') {
        const w = end.x - start.x;
        const h = end.y - start.y;
        if (shapeFill) tctx.fillRect(start.x, start.y, w, h);
        tctx.strokeRect(start.x, start.y, w, h);
      } else if (type === 'ellipse') {
        const rx = (end.x - start.x) / 2;
        const ry = (end.y - start.y) / 2;
        const cx = start.x + rx;
        const cy = start.y + ry;
        tctx.beginPath();
        tctx.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, 0, Math.PI * 2);
        if (shapeFill) tctx.fill();
        tctx.stroke();
      }

      // Apply mask
      tctx.globalCompositeOperation = 'destination-in';
      if (selectionMaskRef.current) {
         tctx.drawImage(selectionMaskRef.current, 0, 0);
      }
      
      // Draw result to buffer
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.drawImage(temp, 0, 0);

    } else {
      // Normal drawing without mask
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = brushSize;
      ctx.globalAlpha = brushOpacity;
      
      if (type === 'line') {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      } else if (type === 'rect') {
        const w = end.x - start.x;
        const h = end.y - start.y;
        if (shapeFill) ctx.fillRect(start.x, start.y, w, h);
        ctx.strokeRect(start.x, start.y, w, h);
      } else if (type === 'ellipse') {
        const rx = (end.x - start.x) / 2;
        const ry = (end.y - start.y) / 2;
        const cx = start.x + rx;
        const cy = start.y + ry;
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, 0, Math.PI * 2);
        if (shapeFill) ctx.fill();
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1;
    flushPaintBuffer();
    refreshImageNode(activeLayer);
    pushHistorySnapshot();
    addToRecentColors(color);
  };

  const pickColor = (evt: PointerEvent) => {
    const pos = toCanvasPoint(evt);
    if (!pos) return;
    const picked = sampleCompositeColor(pos.x, pos.y);
    setColor(picked);
    addToRecentColors(picked);
    setTool('brush');
  };

  const clearLayer = (id: number) => {
    const canvas = layersRef.current[id];
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    refreshImageNode(id);
  };

  const addLayer = () => {
    const id = Date.now();
    setLayers((prev) => [...prev, { id, name: `Capa ${prev.length + 1}`, visible: true, opacity: 1, blend: 'source-over' }]);
    setActiveLayer(id);
  };

  const removeLayer = (id: number) => {
    if (layers.length <= 1) return;
    setLayers((prev) => prev.filter((l) => l.id !== id));
    if (activeLayer === id && layers.length > 1) setActiveLayer(layers[0].id);
    pushHistorySnapshot();
  };

  const setLayerOpacity = (id: number, opacity: number) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, opacity } : l)));
    // Force refresh of the layer node to apply opacity
    setTimeout(() => refreshImageNode(id), 0);
  };

  const setLayerBlend = (id: number, blend: Blend) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, blend } : l)));
    // Force refresh
    setTimeout(() => refreshImageNode(id), 0);
  };

  const canvasToCompositeBlob = async () => {
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const tmp = document.createElement('canvas');
    tmp.width = Math.floor(canvasWidth * dpr);
    tmp.height = Math.floor(canvasHeight * dpr);
    const ctx = tmp.getContext('2d');
    if (!ctx) throw new Error('no ctx');
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, tmp.width, tmp.height);
    for (const l of layers) {
      if (!l.visible) continue;
      const lc = layersRef.current[l.id];
      if (!lc) continue;
      ctx.globalAlpha = l.opacity;
      ctx.globalCompositeOperation = l.blend;
      ctx.drawImage(lc, 0, 0, tmp.width, tmp.height);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    return await toBlob(tmp, 'image/png');
  };

  const applyHistory = useCallback(
    async (idx: number) => {
      const entry = historyRef.current[idx];
      if (!entry) return;
      setCanvasWidth(entry.size.w);
      setCanvasHeight(entry.size.h);
      setLayers(entry.layers.map(({ id, name, visible, opacity, blend }) => ({ id, name, visible, opacity, blend })));
      setActiveLayer(entry.activeLayer);
      for (const l of entry.layers) {
        const canvas = layersRef.current[l.id] || document.createElement('canvas');
        canvas.width = entry.size.w * (window.devicePixelRatio || 1);
        canvas.height = entry.size.h * (window.devicePixelRatio || 1);
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const bmp = await createImageBitmap(l.blob);
        ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
        layersRef.current[l.id] = canvas;
        refreshImageNode(l.id);
      }
      historyIndexRef.current = idx;
      setHistoryMeta({ index: historyIndexRef.current, length: historyRef.current.length });
    },
    [refreshImageNode],
  );

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) applyHistory(historyIndexRef.current - 1);
  }, [applyHistory]);

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) applyHistory(historyIndexRef.current + 1);
  }, [applyHistory]);

  useEffect(() => {
    if (initialSnapshotDone.current) return;
    initialSnapshotDone.current = true;
    pushHistorySnapshot();
  }, [pushHistorySnapshot]);

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      const cmd = ev.ctrlKey || ev.metaKey;
      if (!cmd) return;
      if (ev.key.toLowerCase() === 'z') {
        ev.preventDefault();
        if (ev.shiftKey) redo(); else undo();
      } else if (ev.key.toLowerCase() === 'y') {
        ev.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [redo, undo]);

  const exportPNG = async () => {
    try {
      setStatus('Exportando...');
      const blob = await canvasToCompositeBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName || 'dibujo'}.png`;
      a.click();
      setStatus('Listo');
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (err) {
      console.error(err);
      setStatus('Error al exportar');
    }
  };

  const saveToIDB = async () => {
    try {
      setStatus('Guardando...');
      const blob = await canvasToCompositeBlob();
      const item: StoredScreenshot = {
        id: `${Date.now()}`,
        name: `${fileName || 'dibujo'}.png`,
        date: new Date().toISOString(),
        blob,
      };
      await saveScreenshot(item);
      setStatus('Guardado');
      setTimeout(() => setStatus('Listo'), 1400);
    } catch (err) {
      console.error(err);
      setStatus('Error al guardar');
    }
  };

  const fitView = () => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const margin = 80;
    const scale = Math.min((rect.width - margin) / canvasWidth, (rect.height - margin) / canvasHeight);
    setViewScale(clamp(scale, 0.35, 3));
    setPan({ x: 0, y: 0 });
  };

  const resetView = () => {
    setViewScale(1);
    setPan({ x: 0, y: 0 });
  };

  const applyResolution = (w: number, h: number) => {
    setCanvasWidth(Math.round(w));
    setCanvasHeight(Math.round(h));
  };

  const applyFullscreen = () => {
    if (typeof window === 'undefined') return;
    const margin = 60;
    applyResolution(window.innerWidth - margin, window.innerHeight - margin);
  };

  const clearSelection = useCallback(() => {
    selectionHasMaskRef.current = false;
    setSelectionActive(false);
    clearCanvas(selectionMaskRef.current);
    selectionPathRef.current = [];
  }, []);

  const uiTools = useMemo(
    () => [
      { key: 'brush', label: 'Pincel', icon: <Brush size={20} /> },
      { key: 'pen', label: 'Pluma', icon: <PenTool size={20} /> },
      { key: 'eraser', label: 'Borrar', icon: <Eraser size={20} /> },
      { key: 'eyedropper', label: 'Picker', icon: <Droplet size={20} /> },
      { key: 'mixer', label: 'Mixer', icon: <Wand2 size={20} /> },
      { key: 'lasso', label: 'Lazo', icon: <Wand2 size={20} /> },
      { key: 'magic-wand', label: 'Varita', icon: <Wand2 size={20} /> },
      // Shape tool is handled separately in render
      { key: 'pan', label: 'Pan', icon: <Move size={20} /> },
    ],
    [],
  );

  // No renderizar nada hasta que esté montado en el cliente
  if (!mounted || typeof window === 'undefined') {
    return (
      <main className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#0b132b] text-slate-200 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
          <p className="text-slate-400">Cargando lienzo...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#0b132b] text-slate-200 flex flex-col font-sans">
      <div className="aurora-ribbon opacity-30 pointer-events-none" aria-hidden />
      <div className="absolute inset-0 grid-ambient opacity-10 pointer-events-none" aria-hidden />
      <FloatingPetals count={12} />

      {/* Top Header Bar */}
      <header className="h-14 flex-shrink-0 border-b border-white/10 bg-[#111827]/90 backdrop-blur-md flex items-center px-4 justify-between z-50 shadow-md">
        <div className="flex items-center gap-4">
          <Link
            href="/main"
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-pink-500 hover:text-pink-400"
            title="Volver al menú"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <Sparkles size={14} className="text-pink-400" /> LIENZO VOLADOR
            </h1>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Estudio de Arte</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#1f2937] rounded-lg p-1 border border-white/10">
            <button onClick={undo} disabled={historyMeta.index <= 0} className="p-2 hover:bg-white/10 rounded disabled:opacity-30 transition-colors" title="Deshacer (Ctrl+Z)">
              <Undo2 size={18} />
            </button>
            <button onClick={redo} disabled={historyMeta.index >= historyMeta.length - 1} className="p-2 hover:bg-white/10 rounded disabled:opacity-30 transition-colors" title="Rehacer (Ctrl+Y)">
              <Redo2 size={18} />
            </button>
          </div>
          
          <div className="h-6 w-px bg-white/10 mx-1" />

          <button onClick={saveToIDB} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors shadow-lg shadow-emerald-900/20">
            <Save size={16} />
            <span className="hidden sm:inline">Guardar</span>
          </button>
          <button onClick={exportPNG} className="flex items-center gap-2 px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-xs font-medium transition-colors shadow-lg shadow-pink-900/20">
            <Download size={16} />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* Left Sidebar: Tools */}
        <aside className="w-[72px] flex-shrink-0 border-r border-white/10 bg-[#1f2937]/95 flex flex-col items-center py-4 gap-3 overflow-y-auto z-40 shadow-xl">
          {uiTools.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setTool(btn.key as Tool)}
              title={btn.label}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                tool === btn.key 
                  ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30 scale-110' 
                  : 'text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {btn.icon}
            </button>
          ))}

          {/* Grouped Shape Tool */}
          <div className="relative">
            <button
              onClick={() => {
                setTool('shape');
                setShowShapeMenu(!showShapeMenu);
              }}
              title="Formas"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 relative ${
                tool === 'shape'
                  ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30 scale-110' 
                  : 'text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {activeShape === 'rect' && <Square size={20} />}
              {activeShape === 'ellipse' && <Circle size={20} />}
              {activeShape === 'line' && <Diamond size={20} />}
              <div className="absolute bottom-0.5 right-0.5">
                <ChevronRight size={8} className="rotate-45" />
              </div>
            </button>
            
            {showShapeMenu && (
              <div className="absolute left-full top-0 ml-2 bg-[#1f2937] border border-white/10 rounded-xl p-2 shadow-xl flex flex-col gap-2 z-50">
                <button onClick={() => { setActiveShape('rect'); setTool('shape'); setShowShapeMenu(false); }} className={`p-2 rounded hover:bg-white/10 ${activeShape === 'rect' ? 'text-pink-400' : 'text-slate-400'}`}><Square size={20} /></button>
                <button onClick={() => { setActiveShape('ellipse'); setTool('shape'); setShowShapeMenu(false); }} className={`p-2 rounded hover:bg-white/10 ${activeShape === 'ellipse' ? 'text-pink-400' : 'text-slate-400'}`}><Circle size={20} /></button>
                <button onClick={() => { setActiveShape('line'); setTool('shape'); setShowShapeMenu(false); }} className={`p-2 rounded hover:bg-white/10 ${activeShape === 'line' ? 'text-pink-400' : 'text-slate-400'}`}><Diamond size={20} /></button>
              </div>
            )}
          </div>
          
          <div className="w-8 h-px bg-white/10 my-1" />
          
          <div className="flex flex-col gap-3">
             <div className="relative group">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white/20 shadow-inner cursor-pointer"
                  style={{ backgroundColor: color }}
                />
                <input 
                  type="color" 
                  value={color} 
                  onChange={(e) => { setColor(e.target.value); addToRecentColors(e.target.value); }} 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
             </div>
          </div>
        </aside>

        {/* Center: Canvas Viewport */}
        <section 
          className="flex-1 relative overflow-hidden bg-[#0f172a] flex items-center justify-center select-none"
          ref={frameRef}
          onWheel={wheelZoom}
        >
          {/* Viewport Controls Overlay */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#1f2937]/80 backdrop-blur border border-white/10 rounded-full p-1 px-3 z-30 shadow-xl">
             <button onClick={() => setViewScale((s) => clamp(Number((s - 0.1).toFixed(2)), 0.35, 3))} className="p-1.5 hover:bg-white/10 rounded-full text-slate-300"><ZoomOut size={14} /></button>
             <span className="text-xs font-mono w-12 text-center text-slate-200">{Math.round(viewScale * 100)}%</span>
             <button onClick={() => setViewScale((s) => clamp(Number((s + 0.1).toFixed(2)), 0.35, 3))} className="p-1.5 hover:bg-white/10 rounded-full text-slate-300"><ZoomIn size={14} /></button>
             <div className="w-px h-3 bg-white/20 mx-1" />
             <button onClick={resetView} className="p-1.5 hover:bg-white/10 rounded-full text-slate-300" title="Reset View"><Maximize size={14} /></button>
             <button onClick={fitView} className="text-[10px] px-2 py-1 hover:bg-white/10 rounded text-slate-300 font-medium">AJUSTAR</button>
          </div>

          {/* Canvas Container */}
          <div
            className="relative shadow-[0_0_100px_rgba(0,0,0,0.5)] bg-white"
            style={{ 
              width: `${canvasWidth}px`, 
              height: `${canvasHeight}px`, 
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${viewScale})`, 
              transformOrigin: 'center',
              cursor: isPanning || tool === 'pan' ? 'grabbing' : 'crosshair',
              imageRendering: 'auto', // Ensure smooth interpolation
              willChange: 'transform'
            }}
          >
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none opacity-50" style={{ backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px', zIndex: 1 }} />
            )}

            <Stage
              ref={stageRef}
              width={canvasWidth}
              height={canvasHeight}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              className="touch-none"
            >
              <Layer listening={false}>
                <Rect width={canvasWidth} height={canvasHeight} fill={bgColor} />
              </Layer>

              {layers.map((l) => (
                <Layer key={l.id} listening={false} visible={l.visible} opacity={l.opacity} globalCompositeOperation={l.blend}>
                  <Group>
                    <KonvaImage
                      ref={(node: KonvaImageType | null) => {
                        imageNodesRef.current[l.id] = node;
                      }}
                      image={layersRef.current[l.id] || undefined}
                      width={canvasWidth}
                      height={canvasHeight}
                    />
                  </Group>
                </Layer>
              ))}

              {/* Active Stroke Preview Layer */}
              <Layer 
                listening={false} 
                ref={previewLayerRef}
                opacity={tool === 'eraser' ? 1 : brushOpacity}
              >
                 <KonvaImage
                    ref={previewImageRef}
                    image={paintBufferRef.current || undefined}
                    width={canvasWidth}
                    height={canvasHeight}
                 />
              </Layer>

              {selectionHasMaskRef.current && (
                <Layer listening={false}>
                  <KonvaImage image={selectionMaskRef.current || undefined} width={canvasWidth} height={canvasHeight} opacity={0.3} />
                </Layer>
              )}

              {shapePreview && (
                <Layer listening={false}>
                  {shapePreview.type === 'line' && (
                    <Line points={[shapePreview.start.x, shapePreview.start.y, shapePreview.end.x, shapePreview.end.y]} stroke={color} strokeWidth={brushSize} lineCap="round" lineJoin="round" opacity={brushOpacity} />
                  )}
                  {shapePreview.type === 'rect' && (
                    <Rect
                      x={Math.min(shapePreview.start.x, shapePreview.end.x)}
                      y={Math.min(shapePreview.start.y, shapePreview.end.y)}
                      width={Math.abs(shapePreview.end.x - shapePreview.start.x)}
                      height={Math.abs(shapePreview.end.y - shapePreview.start.y)}
                      stroke={color}
                      strokeWidth={brushSize}
                      fill={shapeFill ? color : undefined}
                      opacity={brushOpacity}
                    />
                  )}
                  {shapePreview.type === 'ellipse' && (
                    <Ellipse
                      x={(shapePreview.start.x + shapePreview.end.x) / 2}
                      y={(shapePreview.start.y + shapePreview.end.y) / 2}
                      radiusX={Math.abs(shapePreview.end.x - shapePreview.start.x) / 2}
                      radiusY={Math.abs(shapePreview.end.y - shapePreview.start.y) / 2}
                      stroke={color}
                      strokeWidth={brushSize}
                      fill={shapeFill ? color : undefined}
                      opacity={brushOpacity}
                    />
                  )}
                </Layer>
              )}
            </Stage>

            {cursorPos && tool !== 'eyedropper' && !isPanning && (
              <div
                className="pointer-events-none absolute rounded-full border border-pink-500/70"
                style={{ width: `${brushSize}px`, height: `${brushSize}px`, left: cursorPos.x - brushSize / 2, top: cursorPos.y - brushSize / 2, boxShadow: '0 0 0 1px rgba(255,255,255,0.8)' }}
              />
            )}
          </div>
        </section>

        {/* Right Sidebar: Properties & Layers */}
        <aside className="w-[300px] flex-shrink-0 border-l border-white/10 bg-[#1f2937]/95 flex flex-col overflow-hidden z-40 shadow-xl">
          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
            
            {/* Brush Settings */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Settings size={12} /> Pincel
              </h3>
              <div className="bg-[#111827]/50 rounded-xl p-3 border border-white/5 space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Tamaño</span>
                    <span>{brushSize}px</span>
                  </div>
                  <input type="range" min={1} max={80} value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-full accent-pink-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Opacidad</span>
                    <span>{Math.round(brushOpacity * 100)}%</span>
                  </div>
                  <input type="range" min={0.05} max={1} step={0.01} value={brushOpacity} onChange={(e) => setBrushOpacity(Number(e.target.value))} className="w-full accent-pink-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Suavizado</span>
                    <span>{Math.round(smoothing * 100)}%</span>
                  </div>
                  <input type="range" min={0} max={1} step={0.02} value={smoothing} onChange={(e) => setSmoothing(Number(e.target.value))} className="w-full accent-pink-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Palette size={12} /> Paleta
              </h3>
              
              {/* Recent Colors */}
              {recentColors.length > 0 && (
                <div className="mb-2">
                  <span className="text-[10px] text-slate-500 mb-1 block">Recientes</span>
                  <div className="flex flex-wrap gap-1.5">
                    {recentColors.map((rc, i) => (
                      <button 
                        key={i} 
                        onClick={() => setColor(rc)} 
                        className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition-transform shadow-sm" 
                        style={{ background: rc }} 
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-5 gap-2">
                {uiSwatches.map((sw) => (
                  <button 
                    key={sw} 
                    onClick={() => { setColor(sw); addToRecentColors(sw); }} 
                    className="w-full aspect-square rounded-lg border border-white/10 hover:scale-110 transition-transform shadow-sm" 
                    style={{ background: sw }} 
                  />
                ))}
              </div>
            </div>

            {/* Layers */}
            <div className="space-y-3 flex-1 flex flex-col min-h-[200px]">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <LayersIcon size={12} /> Capas
                </h3>
                <button onClick={addLayer} className="p-1 hover:bg-white/10 rounded text-pink-400 transition-colors" title="Nueva capa">
                  <Plus size={16} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[300px]">
                {layers.map((l) => (
                  <div 
                    key={l.id} 
                    className={`group flex items-center gap-2 rounded-lg p-2 border transition-all ${
                      activeLayer === l.id 
                        ? 'border-pink-500/50 bg-pink-500/10' 
                        : 'border-white/5 bg-[#111827]/50 hover:border-white/20'
                    }`}
                  >
                    <button 
                      onClick={() => setLayers((prev) => prev.map((it) => (it.id === l.id ? { ...it, visible: !it.visible } : it)))} 
                      className={`p-1 rounded hover:bg-white/10 ${l.visible ? 'text-slate-300' : 'text-slate-600'}`}
                    >
                      {l.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    
                    <div 
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => setActiveLayer(l.id)}
                    >
                      <div className="text-xs font-medium text-slate-200 truncate">{l.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <input 
                          type="range" 
                          min={0} max={1} step={0.05} 
                          value={l.opacity} 
                          onChange={(e) => setLayerOpacity(l.id, Number(e.target.value))}
                          onClick={(e) => e.stopPropagation()}
                          className="w-16 h-1 accent-slate-400 bg-slate-700 rounded-lg appearance-none" 
                        />
                        <select 
                          value={l.blend} 
                          onChange={(e) => setLayerBlend(l.id, e.target.value as Blend)}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] bg-transparent text-slate-400 border-none p-0 focus:ring-0 cursor-pointer"
                        >
                          <option value="source-over">Normal</option>
                          <option value="multiply">Multiply</option>
                          <option value="screen">Screen</option>
                          <option value="overlay">Overlay</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeLayer(l.id)} 
                      className="p-1.5 rounded hover:bg-red-500/20 hover:text-red-400 text-slate-600 opacity-0 group-hover:opacity-100 transition-all"
                      disabled={layers.length <= 1}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Canvas Settings */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lienzo</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500">Ancho</label>
                  <input type="number" value={canvasWidth} onChange={(e) => setCanvasWidth(Number(e.target.value))} className="w-full bg-[#111827] border border-white/10 rounded px-2 py-1 text-xs text-slate-300" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500">Alto</label>
                  <input type="number" value={canvasHeight} onChange={(e) => setCanvasHeight(Number(e.target.value))} className="w-full bg-[#111827] border border-white/10 rounded px-2 py-1 text-xs text-slate-300" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <label className="text-xs text-slate-400">Fondo</label>
                 <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none" />
              </div>
            </div>

          </div>
        </aside>
      </div>
    </main>
  );
}
