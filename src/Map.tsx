import React, { useRef, useLayoutEffect, useMemo, useState, useCallback } from 'react';
import StandardMap from './maps/Standard.txt';
import ForestMap from './maps/Forest.txt';
import type { MapKey } from './App';
import {
    FootprintColor,
    FieldColor,
    HaloColor,
    FootprintBuildable,
    FootprintUnbuildable,
} from './constants.d';
import {
    Dirt,
    Marsh,
    Grass,
    Brush,
    Water,
    Buildings,
    Paths,
    Noop,
} from './terrain.d';
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
    position: 'relative',
};

const cellToColor: Record<string, string> = {
    D: Dirt.color,
    M: Marsh.color,
    G: Grass.color,
    F: Buildings.color,
    W: Water.color,
    P: Paths.color,
    X: Noop.color,
};
const defaultColor = Brush.color;

const BUILDABLE_CELLS = new Set(['D', 'M', 'G']);
const FARMABLE_CELLS = new Set(['D', 'M']);
const getColor = (cell: string) => cellToColor[cell] ?? defaultColor;
const isBuildable = (cell: string) => BUILDABLE_CELLS.has(cell);
const isFarmable = (cell: string) => FARMABLE_CELLS.has(cell);

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

function getOccupiedTiles(
    structs: Record<Structs, Set<[number, number]>>,
    rowCount: number,
    colCount: number,
    excludeOrigin?: { structName: Structs; cell: [number, number] }
): Set<string> {
    const occupied = new Set<string>();
    const allStructTypes = Object.keys(structRegistry) as Structs[];
    let excludeTiles: Set<string> | undefined;
    if (excludeOrigin) {
        const config = structRegistry[excludeOrigin.structName];
        if (config) {
            excludeTiles = new Set(
                getFootprintTiles(excludeOrigin.cell, rowCount, colCount, config.footprintFunction).map(
                    ([c, r]) => `${c},${r}`
                )
            );
        }
    }
    for (const structType of allStructTypes) {
        const config = structRegistry[structType];
        const coords = structs[structType];
        if (!coords || !config) continue;
        for (const coord of coords) {
            const footprint = getFootprintTiles(coord, rowCount, colCount, config.footprintFunction);
            for (const [c, r] of footprint) {
                const key = `${c},${r}`;
                if (!excludeTiles?.has(key)) occupied.add(key);
            }
        }
    }
    return occupied;
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
        imageCache: Record<string, HTMLImageElement>;
        onImageLoad: () => void;
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

    // Field color: farmable tiles under sprinkler AOE (all views, beneath other AOE halos)
    const sprinklerStructTypes = getStructsForView(Views.Sprinkler);
    for (const structType of sprinklerStructTypes) {
        const config = structRegistry[structType];
        const coords = opts.structs[structType];
        if (!coords || !config?.aoeFunction) continue;
        for (const coord of coords) {
            for (let r = 0; r < rowCount; r++) {
                for (let c = 0; c < colCount; c++) {
                    const tile: [number, number] = [c, r];
                    if (!config.aoeFunction(coord, tile)) continue;
                    if (!isFarmable(mapRows[r]?.[c] ?? '')) continue;
                    ctx.fillStyle = FieldColor;
                    ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
                }
            }
        }
    }

    // AOE halos for built structs of the current view (on top of field color)
    const structTypesForView = getStructsForView(opts.view);
    for (const structType of structTypesForView) {
        const config = structRegistry[structType];
        const coords = opts.structs[structType];
        if (!coords || !config?.aoeFunction) continue;
        const isSprinkler = config.view === Views.Sprinkler;
        for (const coord of coords) {
            for (let r = 0; r < rowCount; r++) {
                for (let c = 0; c < colCount; c++) {
                    const tile: [number, number] = [c, r];
                    if (!config.aoeFunction(coord, tile)) continue;
                    if (isSprinkler && isFarmable(mapRows[r]?.[c] ?? '')) continue;
                    ctx.fillStyle = HaloColor;
                    ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
                }
            }
        }
    }

    // Struct footprint (placed structs) - gray background + building image scale-to-fit inside, centered
    const allStructTypes = Object.keys(structRegistry) as Structs[];
    for (const structType of allStructTypes) {
        const config = structRegistry[structType];
        const coords = opts.structs[structType];
        if (!coords || !config) continue;
        for (const coord of coords) {
            const footprint = getFootprintTiles(coord, rowCount, colCount, config.footprintFunction);
            if (footprint.length === 0) continue;
            let minC = footprint[0][0], maxC = footprint[0][0], minR = footprint[0][1], maxR = footprint[0][1];
            for (const [c, r] of footprint) {
                minC = Math.min(minC, c);
                maxC = Math.max(maxC, c);
                minR = Math.min(minR, r);
                maxR = Math.max(maxR, r);
            }
            const x = minC * cellW;
            const y = minR * cellH;
            const w = (maxC - minC + 1) * cellW;
            const h = (maxR - minR + 1) * cellH;
            ctx.fillStyle = FootprintColor;
            ctx.fillRect(x, y, w, h);
            if (config.imageSrc) {
                const img = opts.imageCache[config.imageSrc];
                if (img?.complete && img.naturalWidth > 0) {
                    const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight);
                    const drawW = img.naturalWidth * scale;
                    const drawH = img.naturalHeight * scale;
                    const drawX = x + (w - drawW) / 2;
                    const drawY = y + (h - drawH) / 2;
                    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, drawX, drawY, drawW, drawH);
                } else {
                    if (!opts.imageCache[config.imageSrc]) {
                        const image = new Image();
                        image.onload = () => opts.onImageLoad();
                        image.src = config.imageSrc;
                        opts.imageCache[config.imageSrc] = image;
                    }
                }
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
            const occupied = getOccupiedTiles(opts.structs, rowCount, colCount);
            const dragHaloColor = config.view === Views.Sprinkler ? FieldColor : HaloColor;

            for (let r = 0; r < rowCount; r++) {
                for (let c = 0; c < colCount; c++) {
                    const tile: [number, number] = [c, r];
                    if (!aoeFunction(origin, tile)) continue;
                    if (config.view === Views.Sprinkler && !isFarmable(mapRows[r]?.[c] ?? '')) continue;
                    ctx.fillStyle = dragHaloColor;
                    ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
                }
            }
            for (const [c, r] of footprintTiles) {
                const cell = mapRows[r]?.[c];
                const buildable = cell !== undefined && isBuildable(cell) && !occupied.has(`${c},${r}`);
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

const MAP_CONTENT: Record<MapKey, string> = {
    standard: StandardMap as string,
    forest: ForestMap as string,
};

const Map = ({ mapKey }: { mapKey: MapKey }) => {
    const map = MAP_CONTENT[mapKey];
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
    const imageCacheRef = useRef<Record<string, HTMLImageElement>>({});
    const transparentDragImageRef = useRef<HTMLDivElement | null>(null);
    const dropHandledOnCanvasRef = useRef(false);
    useLayoutEffect(() => {
        const el = document.createElement('div');
        el.style.width = '1px';
        el.style.height = '1px';
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        transparentDragImageRef.current = el;
        return () => {
            document.body.removeChild(el);
            transparentDragImageRef.current = null;
        };
    }, []);

    const view = useStore((state) => state.view);
    const structs = useStructStore((state) => state.structs);
    const currentStruct = useStructStore((state) => state.currentStruct);
    const currentStructMoveOrigin = useStructStore((state) => state.currentStructMoveOrigin);
    const setCurrentStruct = useStructStore((state) => state.setCurrentStruct);
    const setCurrentStructForMove = useStructStore((state) => state.setCurrentStructForMove);
    const addStruct = useStructStore((state) => state.addStruct);
    const removeStruct = useStructStore((state) => state.removeStruct);
    const [hoverCell, setHoverCell] = useState<[number, number] | null>(null);
    const [imageLoadCounter, setImageLoadCounter] = useState(0);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

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
                    imageCache: imageCacheRef.current,
                    onImageLoad: () => setImageLoadCounter((c) => c + 1),
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
            setCanvasSize({ width, height });
            redraw();
        };

        resize();
        const observer = new ResizeObserver(resize);
        observer.observe(wrapper);
        return () => observer.disconnect();
    }, [mapRows, rowCount, colCount, view, structs, hoverCell, currentStruct?.name, imageLoadCounter]);

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
        dropHandledOnCanvasRef.current = true;
        const cell = getCellFromEvent(canvas, e, colCount, rowCount);
        setHoverCell(null);

        if (currentStructMoveOrigin) {
            if (cell === null) {
                currentStruct.raze(currentStructMoveOrigin);
                return;
            }
            if (cell[0] === currentStructMoveOrigin[0] && cell[1] === currentStructMoveOrigin[1]) {
                return;
            }
        } else if (cell === null) {
            return;
        }

        const config = structRegistry[currentStruct.name];
        if (!config) return;
        const footprintTiles = getFootprintTiles(cell, rowCount, colCount, config.footprintFunction);
        const excludeOrigin =
            currentStructMoveOrigin && currentStruct
                ? { structName: currentStruct.name, cell: currentStructMoveOrigin }
                : undefined;
        const occupied = getOccupiedTiles(structs, rowCount, colCount, excludeOrigin);
        const allBuildable = footprintTiles.every(([c, r]) => {
            const ch = mapRows[r]?.[c];
            return ch !== undefined && isBuildable(ch) && !occupied.has(`${c},${r}`);
        });
        if (allBuildable) {
            currentStruct.build(cell);
        } else if (currentStructMoveOrigin) {
            currentStruct.raze(currentStructMoveOrigin);
        }
    }, [colCount, rowCount, currentStruct, currentStructMoveOrigin, mapRows, structs]);

    const cellW = canvasSize.width / colCount || 0;
    const cellH = canvasSize.height / rowCount || 0;

    const overlayStyle: React.CSSProperties = {
        position: 'absolute',
        left: 0,
        top: 0,
        width: canvasSize.width,
        height: canvasSize.height,
        pointerEvents: 'none',
    };

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
            <div style={overlayStyle}>
                {(Object.keys(structRegistry) as Structs[]).flatMap((structType) => {
                    const config = structRegistry[structType];
                    const coords = structs[structType];
                    if (!config || !coords) return [];
                    return Array.from(coords).map((coord) => {
                        const footprint = getFootprintTiles(
                            coord,
                            rowCount,
                            colCount,
                            config.footprintFunction
                        );
                        if (footprint.length === 0) return null;
                        let minC = footprint[0][0],
                            maxC = footprint[0][0],
                            minR = footprint[0][1],
                            maxR = footprint[0][1];
                        for (const [c, r] of footprint) {
                            minC = Math.min(minC, c);
                            maxC = Math.max(maxC, c);
                            minR = Math.min(minR, r);
                            maxR = Math.max(maxR, r);
                        }
                        const left = minC * cellW;
                        const top = minR * cellH;
                        const w = (maxC - minC + 1) * cellW;
                        const h = (maxR - minR + 1) * cellH;
                        const StructComponent = config.component;
                        return (
                            <div
                                key={`${structType}-${coord[0]}-${coord[1]}`}
                                draggable
                                onDragStart={(e) => {
                                    dropHandledOnCanvasRef.current = false;
                                    e.dataTransfer.setData('text/plain', structType);
                                    e.dataTransfer.effectAllowed = 'move';
                                    setCurrentStructForMove(
                                        {
                                            name: structType,
                                            sprite: StructComponent,
                                            build: (newCell: [number, number]) => {
                                                removeStruct(structType, coord);
                                                addStruct(structType, newCell);
                                            },
                                            raze: (c: [number, number]) => removeStruct(structType, c),
                                            aoeFunction: config.aoeFunction,
                                            footprintFunction: config.footprintFunction,
                                        },
                                        coord
                                    );
                                    if (e.dataTransfer && transparentDragImageRef.current) {
                                        e.dataTransfer.setDragImage(transparentDragImageRef.current, 0, 0);
                                    }
                                }}
                                onDragEnd={() => {
                                    const state = useStructStore.getState();
                                    if (
                                        !dropHandledOnCanvasRef.current &&
                                        state.currentStructMoveOrigin &&
                                        state.currentStruct
                                    ) {
                                        state.currentStruct.raze(state.currentStructMoveOrigin);
                                    }
                                    setCurrentStruct(undefined);
                                }}
                                style={{
                                    position: 'absolute',
                                    left,
                                    top,
                                    width: w,
                                    height: h,
                                    pointerEvents: 'auto',
                                    cursor: 'grab',
                                }}
                            />
                        );
                    });
                })}
            </div>
        </div>
    );
}

export default Map;
