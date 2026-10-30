import { MyEditor } from './editor.js';
import { Toolbar } from './toolbar.js';
import { MainMenu } from './menu.js';
import { TOOLS, findTool } from './tools.js';

const CMD_CLEAR = 'clear';
const CMD_ABOUT = 'about';

export class MainWindow {
    constructor({ menubar, toolbar, canvas, status }) {
        this.statusEl = status;

        this.editor = new MyEditor(canvas);
        this.editor.onMessage = (text) => this.setStatus(text);

        this.menu = new MainMenu(menubar, this);
        this.toolbar = new Toolbar(toolbar, this);
        this.currentTool = null;

        this.onSize = this.onSize.bind(this);
        window.addEventListener('resize', this.onSize);
    }
    onCreate() {
        this.menu.addMenu('Файл', [{ id: CMD_CLEAR, text: 'Очистити' }]);
        this.menu.addMenu('Об\'єкти', TOOLS.map((t) => ({ id: t.id, text: t.name })));
        this.menu.addMenu('Довідка', [{ id: CMD_ABOUT, text: 'Про програму' }]);

        this.toolbar.addButton(CMD_CLEAR, '×');
        this.toolbar.addSeparator();
        TOOLS.forEach((t) => this.toolbar.addButton(t.id, t.icon));

        this.onSize();
        this.setStatus('Оберіть тип об\'єкта в меню "Об\'єкти" або на панелі інструментів');
    }

    onCommand(id) {
        if (id === CMD_CLEAR) {
            this.editor.clear();
            this.setStatus('Очищено');
            return;
        }
        if (id === CMD_ABOUT) {
            alert('Lab4 - графічний редактор об\'єктів з панеллю інструментів');
            return;
        }
        const tool = findTool(id);
        if (tool) {
            this.currentTool = tool;
            this.editor.start(tool.shapeClass);
            this.toolbar.setPressed(tool.id);
            this.setStatus(`Обрано: ${tool.name}`);
        }
    }

    onNotify(nm) {
        if (nm.code !== 'TTN_NEEDTEXT') return null;
        if (nm.id === CMD_CLEAR) return 'Очистити';
        return findTool(nm.id)?.name ?? null;
    }

    onInitMenuPopup(menu) {}

    onSize() {
        this.editor.onSize();
    }

    destroy() {
        window.removeEventListener('resize', this.onSize);
        this.editor.destroy();
    }

    setStatus(text) {
        this.statusEl.textContent = text;
    }
}
