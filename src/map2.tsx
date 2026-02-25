import React, { useRef, useLayoutEffect, useMemo, useState, useCallback } from 'react';
import StandardMap from './maps/Standard.txt';
import { Dirt, Marsh, Grass, Brush, Water, Farmhouse, FootprintColor, HaloColor, FootprintBuildable, FootprintUnbuildable } from './constants';
import useStructStore from './structStore';
import useStore from './store';
import { structRegistry, getStructsForView } from './structRegistry';
import { Structs, Views } from './types.d';

const canvasStyle = {
    border: '1px solid black',
};

const containerStyle: React.CSSProperties = {
    width: '80%',
    minWidth: '500px',
};

const cellToColor: Record<string, string> = {
    D: Dirt.color,
    M: Marsh.color,
    G: Grass.color,
    F: Farmhouse.color,
    W: Water.color,
};
const defaultColor = Brush.color;

const BUILDABLE_CELLS = new Set(['D', 'M', 'G']);
const getColor = (cell: string) => cellToColor[cell] ?? defaultColor;
const isBuildable = (cell: string) => BUILDABLE_CELLS.has(cell);

function getFootprintTiles(
    origin: [number, number],
    rowCount: number,
    colCount: number,
    footprintFunction?: (struct: [number, number], tile: [number, number]) => boolean
): [number, number][] {
    if (!footprintFunction) return [origin];
    const tiles: [number, number][] = [];
    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < colCount; c++) {
            const tile: [number, number] = [c, r];
            if (footprintFunction(origin, tile)) tiles.push(tile);
        }
    }
    return tiles;
}

function getCellFromEvent(
    canvas: HTMLCanvasElement,
    e: React.MouseEvent | React.DragEvent,
    colCount: number,
    rowCount: number
): [number, number] | null {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const cellW = canvas.width / colCount;
    const cellH = canvas.height / rowCount;
    const col = Math.floor(x / cellW);
    const row = Math.floor(y / cellH);
    if (col >= 0 && col < colCount && row >= 0 && row < rowCount) return [col, row];
    return null;
}

const drawGrid = (
    ctx: CanvasRenderingContext2D,
    mapRows: string[][],
    width: number,
    height: number,
    opts: {
        view: Views;
        structs: Record<Structs, Set<[number, number]>>;
        hoverCell: [number, number] | null;
        currentStructName: Structs | undefined;
    }
) => {
    const rowCount = mapRows.length;
    if (rowCount === 0) return;
    const colCount = mapRows[0].length;
    if (colCount === 0) return;
    const cellW = width / colCount;
    const cellH = height / rowCount;

    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {
            const color = getColor(mapRows[i][j]);
            ctx.fillStyle = color;
            ctx.fillRect(j * cellW, i * cellH, cellW, cellH);
        }
    }

    // AOE halos for built structs of the current view
    const structTypesForView = getStructsForView(opts.view);
    for (const structType of structTypesForView) {
        const config = structRegistry[structType];
        const coords = opts.structs[structType];
        if (!coords || !config?.aoeFunction) continue;
        for (const coord of coords) {
            for (let r = 0; r < rowCount; r++) {
                for (let c = 0; c < colCount; c++) {
                    const tile: [number, number] = [c, r];
                    if (config.aoeFunction(coord, tile)) {
                        ctx.fillStyle = HaloColor;
                        ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
                    }
                }
            }
        }
    }

    // Struct footprint (placed structs) - draw over AOE so they stay visible
    for (const structType of structTypesForView) {
        const config = structRegistry[structType];
        const coords = opts.structs[structType];
        if (!coords || !config) continue;
        for (const coord of coords) {
            const footprint = getFootprintTiles(coord, rowCount, colCount, config.footprintFunction);
            for (const [c, r] of footprint) {
                ctx.fillStyle = FootprintColor;
                ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
            }
        }
    }

    // Drag overlay: footprint (red/green) and AOE halo when dragging
    if (opts.hoverCell !== null && opts.currentStructName) {
        const config = structRegistry[opts.currentStructName];
        if (config) {
            const origin = opts.hoverCell;
            const footprintTiles = getFootprintTiles(origin, rowCount, colCount, config.footprintFunction);
            const aoeFunction = config.aoeFunction;

            for (let r = 0; r < rowCount; r++) {
                for (let c = 0; c < colCount; c++) {
                    const tile: [number, number] = [c, r];
                    if (aoeFunction(origin, tile)) {
                        ctx.fillStyle = HaloColor;
                        ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
                    }
                }
            }
            for (const [c, r] of footprintTiles) {
                const cell = mapRows[r]?.[c];
                const buildable = cell !== undefined && isBuildable(cell);
                ctx.fillStyle = buildable ? FootprintBuildable : FootprintUnbuildable;
                ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
            }
        }
    }

    // Grid lines on top
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= colCount; i++) {
        const x = (i / colCount) * width;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
    }
    for (let i = 0; i <= rowCount; i++) {
        const y = (i / rowCount) * height;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
    }
    ctx.stroke();
};

const Map2 = () => {
    const map = StandardMap as string;
    const mapRows = useMemo(() => {
        const lines = map.trim().split('\n').filter(Boolean);
        return lines.map((row) => {
            const trimmed = row.trim();
            return trimmed.includes(' ') ? trimmed.split(' ') : trimmed.split('');
        });
    }, [map]);
    const rowCount = mapRows.length;
    const colCount = mapRows[0]?.length ?? 0;
    const wrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const view = useStore((state) => state.view);
    const structs = useStructStore((state) => state.structs);
    const currentStruct = useStructStore((state) => state.currentStruct);
    const [hoverCell, setHoverCell] = useState<[number, number] | null>(null);

    useLayoutEffect(() => {
        const wrapper = wrapperRef.current;
        const canvas = canvasRef.current;
        if (!wrapper || !canvas || rowCount === 0 || colCount === 0) return;

        const redraw = () => {
            const ctx = canvas!.getContext('2d');
            if (ctx) {
                drawGrid(ctx, mapRows, canvas!.width, canvas!.height, {
                    view,
                    structs,
                    hoverCell,
                    currentStructName: currentStruct?.name,
                });
            }
        };

        const resize = () => {
            const width = Math.round(wrapper!.getBoundingClientRect().width);
            const height = Math.round(width * rowCount / colCount);
            canvas!.width = width;
            canvas!.height = height;
            canvas!.style.width = `${width}px`;
            canvas!.style.height = `${height}px`;
            redraw();
        };

        resize();
        const observer = new ResizeObserver(resize);
        observer.observe(wrapper);
        return () => observer.disconnect();
    }, [mapRows, rowCount, colCount, view, structs, hoverCell, currentStruct?.name]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const canvas = canvasRef.current;
        if (!canvas) return;
        const cell = getCellFromEvent(canvas, e, colCount, rowCount);
        setHoverCell(cell);
    }, [colCount, rowCount]);

    const handleDragLeave = useCallback(() => {
        setHoverCell(null);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas || !currentStruct) {
            setHoverCell(null);
            return;
        }
        const cell = getCellFromEvent(canvas, e, colCount, rowCount);
        setHoverCell(null);
        if (cell === null) return;
        const config = structRegistry[currentStruct.name];
        if (!config) return;
        const footprintTiles = getFootprintTiles(cell, rowCount, colCount, config.footprintFunction);
        const allBuildable = footprintTiles.every(([c, r]) => {
            const ch = mapRows[r]?.[c];
            return ch !== undefined && isBuildable(ch);
        });
        if (allBuildable) {
            currentStruct.build(cell);
        }
    }, [colCount, rowCount, currentStruct, mapRows]);

    return (
        <div ref={wrapperRef} style={containerStyle}>
            <canvas
                ref={canvasRef}
                id="map2"
                style={canvasStyle}
                data-cols={colCount}
                data-rows={rowCount}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            />
        </div>
    );
}

export default Map2;
