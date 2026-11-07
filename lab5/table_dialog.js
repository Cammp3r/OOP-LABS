import { TOOLS } from './tools.js';

export class TableDialog {
    constructor(container) {
        this.container = container;
        this.rows = [];
        this.documentId = null;
        this.onClose = () => {};
        this.onSelect = () => {};
        this.element = document.createElement('section');
        this.element.className = 'table-dialog';
        this.element.setAttribute('role', 'dialog');
        this.element.setAttribute('aria-label', 'Таблиця графічних об’єктів');
        this.element.innerHTML = `
            <header class="dialog-header">
                <strong>Графічні об’єкти</strong>
                <button type="button" class="dialog-close" aria-label="Закрити">×</button>
            </header>
            <div class="table-scroll">
                <table>
                    <thead><tr><th>Назва</th><th>x1</th><th>y1</th><th>x2</th><th>y2</th></tr></thead>
                    <tbody></tbody>
                </table>
            </div>
        `;
        this.tbody = this.element.querySelector('tbody');
        this.element.querySelector('.dialog-close').addEventListener(
            'click',
            () => this.close()
        );
        container.appendChild(this.element);
    }

    show(documentId, shapes) {
        this.documentId = documentId;
        this.update(shapes);
        this.element.classList.add('visible');
    }

    update(shapes) {
        this.rows = shapes;
        this.tbody.replaceChildren();
        shapes.forEach((shape, index) => {
            const row = document.createElement('tr');
            row.tabIndex = 0;
            row.setAttribute('role', 'button');
            row.addEventListener('click', () => this.onSelect(index));
            row.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this.onSelect(index);
                }
            });
            const tool = TOOLS.find((item) => shape.constructor === item.shapeClass);
            const values = [
                tool?.name ?? shape.constructor.name,
                Math.round(shape.xs),
                Math.round(shape.ys),
                Math.round(shape.xe),
                Math.round(shape.ye)
            ];
            for (const value of values) {
                const cell = document.createElement('td');
                cell.textContent = String(value);
                row.appendChild(cell);
            }
            this.tbody.appendChild(row);
        });
    }

    setSelected(index) {
        [...this.tbody.rows].forEach((row, rowIndex) => {
            const selected = rowIndex === index;
            row.classList.toggle('selected', selected);
            row.setAttribute('aria-selected', String(selected));
        });
    }

    close() {
        this.element.classList.remove('visible');
        this.documentId = null;
        this.onClose();
    }
}
