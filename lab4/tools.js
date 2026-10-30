import { PointShape } from './point_shape.js';
import { LineShape } from './line_shape.js';
import { RectShape } from './rect_shape.js';
import { EllipseShape } from './ellipse_shape.js';
import { LineCirclesShape } from './line_circles_shape.js';
import { CubeShape } from './cube_shape.js';


export const TOOLS = [
    {
        id: 'point',
        name: 'Крапка',
        shapeClass: PointShape,
        icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.5" fill="currentColor"/></svg>'
    },
    {
        id: 'line',
        name: 'Лінія',
        shapeClass: LineShape,
        icon: '<svg viewBox="0 0 24 24"><line x1="4" y1="20" x2="20" y2="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
    },
    {
        id: 'rect',
        name: 'Прямокутник',
        shapeClass: RectShape,
        icon: '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" fill="none" stroke="currentColor" stroke-width="2"/></svg>'
    },
    {
        id: 'ellipse',
        name: 'Еліпс',
        shapeClass: EllipseShape,
        icon: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="9" ry="6" fill="none" stroke="currentColor" stroke-width="2"/></svg>'
    },
    {
        id: 'line-circles',
        name: 'Лінія з кружечками',
        shapeClass: LineCirclesShape,
        icon: '<svg viewBox="0 0 24 24"><line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" stroke-width="2"/><circle cx="4" cy="12" r="3" fill="#00bfff" stroke="currentColor"/><circle cx="20" cy="12" r="3" fill="#00bfff" stroke="currentColor"/></svg>'
    },
    {
        id: 'cube',
        name: 'Каркас куба',
        shapeClass: CubeShape,
        icon: '<svg viewBox="0 0 24 24"><path d="M5 8l7-4 7 4v8l-7 4-7-4zM5 8l7 4 7-4M12 12v8" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'
    }
];

export function findTool(id) {
    return TOOLS.find((t) => t.id === id);
}
