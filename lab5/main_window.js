import { MyEditor } from './editor.js';
import { Toolbar } from './toolbar.js';
import { MainMenu } from './menu.js';
import { TableDialog } from './table_dialog.js';
import { TOOLS, findTool } from './tools.js';

const CMD_NEW = 'new';
const CMD_CLEAR = 'clear';
const CMD_TABLE = 'table';
const CMD_SAVE = 'save';
const CMD_TILE = 'tile';
const CMD_CASCADE = 'cascade';
const CMD_ABOUT = 'about';

export class MainWindow {
    constructor({ menubar, toolbar, workspace, table, status }) {
        this.statusEl = status;
        this.workspace = workspace;
        this.editor = MyEditor.getInstance();
        this.documents = [];
        this.activeDocument = null;
        this.nextTitle = 1;
        this.table = new TableDialog(table);
        this.menu = new MainMenu(menubar, this);
        this.toolbar = new Toolbar(toolbar, this);
        this.onSize = this.onSize.bind(this);
        window.addEventListener('resize', this.onSize);
    }

    onCreate() {
        this.menu.addMenu('Файл', [
            { id: CMD_NEW, text: 'Нове вікно' },
            { id: CMD_CLEAR, text: 'Очистити' },
            { id: CMD_TABLE, text: 'Таблиця об’єктів' },
            { id: CMD_SAVE, text: 'Зберегти CSV' }
        ]);
        this.menu.addMenu('Вікно', [
            { id: CMD_TILE, text: 'Розташувати плиткою' },
            { id: CMD_CASCADE, text: 'Каскадом' }
        ]);
        this.menu.addMenu('Об’єкти', TOOLS.map((tool) => ({
            id: tool.id,
            text: tool.name
        })));
        this.menu.addMenu('Довідка', [{ id: CMD_ABOUT, text: 'Про програму' }]);

        this.toolbar.addButton(CMD_NEW, '+');
        this.toolbar.addButton(CMD_CLEAR, '×');
        this.toolbar.addSeparator();
        TOOLS.forEach((tool) => this.toolbar.addButton(tool.id, tool.icon));

        this.createDocument();
        this.setStatus('Створено багатовіконний редактор. Оберіть інструмент.');
    }

    createDocument() {
        const panel = document.createElement('section');
        panel.className = 'document-window';
        panel.innerHTML = `
            <header class="document-titlebar">
                <span></span>
                <button type="button" class="document-close" aria-label="Закрити">×</button>
            </header>
            <canvas class="document-canvas"></canvas>
        `;
        const canvas = panel.querySelector('canvas');
        const title = panel.querySelector('span');
        const item = {
            id: null,
            panel,
            canvas,
            title: `Документ ${this.nextTitle++}`,
            shapeTool: null
        };
        title.textContent = item.title;
        item.id = this.editor.createDocument(
            canvas,
            (message) => this.setStatus(message),
            () => this.onDocumentChanged(item)
        );
        panel.addEventListener('pointerdown', () => this.activateDocument(item));
        panel.querySelector('.document-close').addEventListener(
            'click',
            (event) => {
                event.stopPropagation();
                this.closeDocument(item);
            }
        );
        this.workspace.appendChild(panel);
        this.documents.push(item);
        this.activateDocument(item);
        requestAnimationFrame(() => this.editor.resize(item.id));
    }

    closeDocument(item) {
        if (this.documents.length === 1) {
            this.setStatus('Неможливо закрити останнє вікно');
            return;
        }
        this.editor.destroyDocument(item.id);
        item.panel.remove();
        this.documents = this.documents.filter((entry) => entry !== item);
        if (this.activeDocument === item) {
            this.activateDocument(this.documents[this.documents.length - 1]);
        }
    }

    activateDocument(item) {
        this.activeDocument = item;
        for (const entry of this.documents) {
            entry.panel.classList.toggle('active', entry === item);
        }
        if (this.table.documentId && this.table.documentId !== item.id) {
            this.table.close();
        }
        if (item.shapeTool) {
            this.toolbar.setPressed(item.shapeTool.id);
        }
        this.onDocumentChanged(item);
    }

    onDocumentChanged(item) {
        if (this.activeDocument === item && this.table.documentId === item.id) {
            this.table.update(this.editor.getShapes(item.id));
        }
    }

    onCommand(id) {
        if (id === CMD_NEW) {
            this.createDocument();
            return;
        }
        if (!this.activeDocument) return;
        if (id === CMD_CLEAR) {
            this.editor.clear(this.activeDocument.id);
            this.setStatus('Поточний документ очищено');
            return;
        }
        if (id === CMD_TABLE) {
            this.table.show(
                this.activeDocument.id,
                this.editor.getShapes(this.activeDocument.id)
            );
            return;
        }
        if (id === CMD_SAVE) {
            this.saveCsv();
            return;
        }
        if (id === CMD_TILE) {
            this.tileDocuments();
            return;
        }
        if (id === CMD_CASCADE) {
            this.cascadeDocuments();
            return;
        }
        if (id === CMD_ABOUT) {
            alert('Lab5 — багатовіконний графічний редактор об’єктів');
            return;
        }
        const tool = findTool(id);
        if (tool) {
            this.activeDocument.shapeTool = tool;
            this.editor.start(this.activeDocument.id, tool.shapeClass);
            this.toolbar.setPressed(tool.id);
            this.setStatus(`Обрано: ${tool.name}`);
        }
    }

    onNotify(notification) {
        if (notification.code !== 'TTN_NEEDTEXT') return null;
        if (notification.id === CMD_NEW) return 'Нове вікно';
        if (notification.id === CMD_CLEAR) return 'Очистити';
        return findTool(notification.id)?.name ?? null;
    }

    onInitMenuPopup() {}

    tileDocuments() {
        const columns = Math.ceil(Math.sqrt(this.documents.length));
        const rows = Math.ceil(this.documents.length / columns);
        this.documents.forEach((item, index) => {
            item.panel.style.left = `${(index % columns) * (100 / columns)}%`;
            item.panel.style.top = `${Math.floor(index / columns) * (100 / rows)}%`;
            item.panel.style.width = `${100 / columns}%`;
            item.panel.style.height = `${100 / rows}%`;
        });
        this.setStatus('Вікна розташовано плиткою');
    }

    cascadeDocuments() {
        this.documents.forEach((item, index) => {
            item.panel.style.left = `${index * 28}px`;
            item.panel.style.top = `${index * 28}px`;
            item.panel.style.width = '70%';
            item.panel.style.height = '70%';
        });
        this.setStatus('Вікна розташовано каскадом');
    }

    saveCsv() {
        const rows = ['Документ,Назва,x1,y1,x2,y2'];
        for (const item of this.documents) {
            for (const shape of this.editor.getShapes(item.id)) {
                const tool = TOOLS.find((entry) => shape.constructor === entry.shapeClass);
                rows.push([
                    item.title,
                    tool?.name ?? shape.constructor.name,
                    shape.xs,
                    shape.ys,
                    shape.xe,
                    shape.ye
                ].join(','));
            }
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
        for (const item of this.documents) {
            this.editor.resize(item.id);
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
