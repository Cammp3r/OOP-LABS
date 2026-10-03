import { Editor } from './editor.js';

const canvas = document.getElementById('canvas');
const status = document.getElementById('status');
const menus = document.querySelectorAll('.menu');
const objectsMenu = document.getElementById('menuObjects');
const objectItems = objectsMenu.querySelectorAll('[data-shape]');

const editor = new Editor(canvas);
editor.onMessage = (text) => {
    status.textContent = text;
    console.log(text);
};

function updateObjectsMenu() {
    objectItems.forEach((item) => {
        item.classList.toggle('checked', item.dataset.shape === editor.currentType);
    });
}

function closeMenus() {
    menus.forEach((m) => m.classList.remove('open'));
}

menus.forEach((menu) => {
    menu.querySelector('.menu-title').addEventListener('click', (e) => {
        e.stopPropagation();
        const wasOpen = menu.classList.contains('open');
        closeMenus();
        if (!wasOpen) {
            if (menu === objectsMenu) updateObjectsMenu();
            menu.classList.add('open');
        }
    });
});
document.addEventListener('click', closeMenus);

objectItems.forEach((item) => {
    item.addEventListener('click', () => {
        editor.setType(item.dataset.shape);
        editor.onMessage(`Обрано: ${item.textContent}`);
    });
});

document.getElementById('miClear').addEventListener('click', () => {
    editor.clear();
    editor.onMessage('Очищено');
});
document.getElementById('miAbout').addEventListener('click', () => {
    alert('Lab2 - простий графічний редактор об\'єктів');
});

window.addEventListener('resize', () => editor.resize());
editor.resize();
editor.onMessage('Оберіть тип об\'єкта в меню "Об\'єкти" і малюйте мишею');
