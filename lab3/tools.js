import { PointShape } from './point_shape.js';
import { LineShape } from './line_shape.js';
import { RectShape } from './rect_shape.js';
import { EllipseShape } from './ellipse_shape.js';


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
        icon: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="9" ry="6" fill="#00bfff" stroke="currentColor" stroke-width="2"/></svg>'
    }
];

export function findTool(id) {
    return TOOLS.find((t) => t.id === id);
}
