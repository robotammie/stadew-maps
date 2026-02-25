import React, { useRef, useLayoutEffect, useMemo } from 'react';
import StandardMap from './maps/Standard.txt';
import { Dirt, Marsh, Grass, Brush, Water, Farmhouse } from './constants';

const canvasStyle = {
    border: '1px solid black',
}

const containerStyle: React.CSSProperties = {
    width: '80%',
    minWidth: '500px',
}

const cellToColor: Record<string, string> = {
    D: Dirt.color,
    M: Marsh.color,
    G: Grass.color,
    F: Farmhouse.color,
    W: Water.color,
};
const defaultColor = Brush.color;

const getColor = (cell: string) => cellToColor[cell] ?? defaultColor;

const drawGrid = (
    ctx: CanvasRenderingContext2D,
    mapRows: string[][],
    width: number,
    height: number
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

    // Draw grid lines on top of color so they remain visible
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
}

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

    useLayoutEffect(() => {
        const wrapper = wrapperRef.current;
        const canvas = canvasRef.current;
        if (!wrapper || !canvas || rowCount === 0 || colCount === 0) return;

        const resize = () => {
            const width = Math.round(wrapper!.getBoundingClientRect().width);
            const height = Math.round(width * rowCount / colCount);
            canvas!.width = width;
            canvas!.height = height;
            canvas!.style.width = `${width}px`;
            canvas!.style.height = `${height}px`;
            const ctx = canvas!.getContext('2d');
            if (ctx) drawGrid(ctx, mapRows, width, height);
        };

        resize();
        const observer = new ResizeObserver(resize);
        observer.observe(wrapper);
        return () => observer.disconnect();
    }, [mapRows, rowCount, colCount]);

    return (
        <div ref={wrapperRef} style={containerStyle}>
            <canvas
                ref={canvasRef}
                id="map2"
                style={canvasStyle}
            />
        </div>
    );
}

export default Map2;
