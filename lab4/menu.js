export class MainMenu {
    constructor(menubar, owner) {
        this.menubar = menubar;
        this.owner = owner;
        this.menus = [];

        this.onDocumentClick = this.onDocumentClick.bind(this);
        document.addEventListener('click', this.onDocumentClick);
    }

    addMenu(title, items) {
        const menu = document.createElement('div');
        menu.className = 'menu';

        const titleBtn = document.createElement('button');
        titleBtn.className = 'menu-title';
        titleBtn.textContent = title;
        titleBtn.addEventListener('click', (e) => this.onTitleClick(e, menu));

        const popup = document.createElement('div');
        popup.className = 'menu-popup';
        for (const { id, text } of items) {
            const item = document.createElement('button');
            item.dataset.id = id;
            item.textContent = text;
            item.addEventListener('click', () => this.onItemClick(id));
            popup.appendChild(item);
        }

        menu.append(titleBtn, popup);
        this.menubar.appendChild(menu);
        this.menus.push(menu);
    }

    onTitleClick(e, menu) {
        e.stopPropagation();
        const wasOpen = menu.classList.contains('open');
        this.closeAll();
        if (!wasOpen) {
            this.owner.onInitMenuPopup(menu);
            menu.classList.add('open');
        }
    }

    onItemClick(id) {
        this.closeAll();
        this.owner.onCommand(id);
    }

    onDocumentClick() {
        this.closeAll();
    }

    closeAll() {
        this.menus.forEach((m) => m.classList.remove('open'));
    }
}
