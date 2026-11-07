import { MyEditor } from './editor.js';
import { Toolbar } from './toolbar.js';
import { MainMenu } from './menu.js';
import { TableDialog } from './table_dialog.js';
import { TOOLS, findTool } from './tools.js';

const CMD_CLEAR = 'clear';
const CMD_TABLE = 'table';
const CMD_SAVE = 'save';
const CMD_ABOUT = 'about';

export class MainWindow {
    constructor({ menubar, toolbar, workspace, table, status }) {
        this.statusEl = status;
        this.workspace = workspace;
        this.editor = MyEditor.getInstance();
        this.document = null;
        this.table = new TableDialog(table);
        this.table.onSelect = (index) => {
            if (this.table.documentId) {
                this.editor.select(this.table.documentId, index);
                this.table.setSelected(index);
            }
        };
        this.menu = new MainMenu(menubar, this);
        this.toolbar = new Toolbar(toolbar, this);
        this.onSize = this.onSize.bind(this);
        window.addEventListener('resize', this.onSize);
    }

    onCreate() {
        this.menu.addMenu('Файл', [
            { id: CMD_CLEAR, text: 'Очистити' },
            { id: CMD_TABLE, text: 'Таблиця об’єктів' },
            { id: CMD_SAVE, text: 'Зберегти CSV' }
        ]);
        this.menu.addMenu('Об’єкти', TOOLS.map((tool) => ({
            id: tool.id,
            text: tool.name
        })));
        this.menu.addMenu('Довідка', [{ id: CMD_ABOUT, text: 'Про програму' }]);

        this.toolbar.addButton(CMD_CLEAR, '×');
        this.toolbar.addSeparator();
        TOOLS.forEach((tool) => this.toolbar.addButton(tool.id, tool.icon));

        this.initializeDocument();
        this.setStatus('Оберіть інструмент і намалюйте об’єкт');
    }

    initializeDocument() {
        const panel = document.createElement('section');
        panel.className = 'document-window active';
        panel.innerHTML = `
            <header class="document-titlebar">
                <span>Графічний редактор</span>
            </header>
            <canvas class="document-canvas"></canvas>
        `;
        const canvas = panel.querySelector('canvas');
        this.document = {
            id: this.editor.createDocument(
                canvas,
                (message) => this.setStatus(message),
                () => this.onDocumentChanged()
            ),
            panel,
            shapeTool: null
        };
        this.workspace.appendChild(panel);
        requestAnimationFrame(() => this.editor.resize(this.document.id));
    }

    onDocumentChanged() {
        if (this.table.documentId === this.document.id) {
            this.table.update(this.editor.getShapes(this.document.id));
        }
    }

    onCommand(id) {
        if (!this.document) return;
        if (id === CMD_CLEAR) {
            this.editor.clear(this.document.id);
            this.setStatus('Документ очищено');
            return;
        }
        if (id === CMD_TABLE) {
            this.table.show(
                this.document.id,
                this.editor.getShapes(this.document.id)
            );
            return;
        }
        if (id === CMD_SAVE) {
            this.saveCsv();
            return;
        }
        if (id === CMD_ABOUT) {
            alert('Lab5 — графічний редактор об’єктів');
            return;
        }
        const tool = findTool(id);
        if (tool) {
            this.document.shapeTool = tool;
            this.editor.start(this.document.id, tool.shapeClass);
            this.toolbar.setPressed(tool.id);
            this.setStatus(`Обрано: ${tool.name}`);
        }
    }

    onNotify(notification) {
        if (notification.code !== 'TTN_NEEDTEXT') return null;
        if (notification.id === CMD_CLEAR) return 'Очистити';
        return findTool(notification.id)?.name ?? null;
    }

    onInitMenuPopup() {}

    saveCsv() {
        const rows = ['Назва,x1,y1,x2,y2'];
        for (const shape of this.editor.getShapes(this.document.id)) {
            const tool = TOOLS.find((entry) => shape.constructor === entry.shapeClass);
            rows.push([
                tool?.name ?? shape.constructor.name,
                shape.xs,
                shape.ys,
                shape.xe,
                shape.ye
            ].join(','));
        }
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob(
            [`\uFEFF${rows.join('\n')}`],
            { type: 'text/csv;charset=utf-8' }
        ));
        link.download = 'lab5-objects.csv';
        link.click();
        URL.revokeObjectURL(link.href);
        this.setStatus('CSV-файл збережено');
    }

    onSize() {
        if (this.document) {
            this.editor.resize(this.document.id);
        }
    }

    destroy() {
        window.removeEventListener('resize', this.onSize);
        this.editor.destroy();
    }

    setStatus(text) {
        this.statusEl.textContent = text;
    }
}
