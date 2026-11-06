export class Toolbar {
    static TOOLTIP_DELAY = 400;

    constructor(container, owner) {
        this.container = container;
        this.owner = owner;
        this.buttons = new Map();
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tooltip';
        document.body.appendChild(this.tooltip);
        this.timer = null;

        this.onClick = this.onClick.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    addButton(id, iconSvg) {
        const btn = document.createElement('button');
        btn.className = 'tb-button';
        btn.dataset.id = id;
        btn.innerHTML = iconSvg;
        btn.addEventListener('click', this.onClick);
        btn.addEventListener('pointerenter', this.onMouseEnter);
        btn.addEventListener('pointerleave', this.onMouseLeave);
        this.container.appendChild(btn);
        this.buttons.set(id, btn);
    }

    addSeparator() {
        const sep = document.createElement('div');
        sep.className = 'tb-separator';
        this.container.appendChild(sep);
    }

    setPressed(id) {
        for (const [btnId, btn] of this.buttons) {
            btn.classList.toggle('pressed', btnId === id);
        }
    }

    onClick(e) {
        this.#hideTooltip();
        this.owner.onCommand(e.currentTarget.dataset.id);
    }

    onMouseEnter(e) {
        const btn = e.currentTarget;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            const text = this.owner.onNotify({
                code: 'TTN_NEEDTEXT',
                id: btn.dataset.id });
                
            if (text) this.#showTooltip(btn, text);
        }, Toolbar.TOOLTIP_DELAY);
    }

    onMouseLeave() {
        this.#hideTooltip();
    }

    #showTooltip(btn, text) {
        const r = btn.getBoundingClientRect();
        this.tooltip.textContent = text;
        this.tooltip.style.left = `${r.left}px`;
        this.tooltip.style.top = `${r.bottom + 4}px`;
        this.tooltip.classList.add('visible');
    }

    #hideTooltip() {
        clearTimeout(this.timer);
        this.tooltip.classList.remove('visible');
    }
}
