import { MainWindow } from './main_window.js';

const mainWindow = new MainWindow({
    menubar: document.getElementById('menubar'),
    toolbar: document.getElementById('toolbar'),
    workspace: document.getElementById('workspace'),
    table: document.getElementById('table'),
    status: document.getElementById('status')
});
mainWindow.onCreate();
window.addEventListener(
    'beforeunload',
    () => mainWindow.destroy(),
    { once: true }
);
window.addEventListener('beforeunload', () => mainWindow.destroy(), { once: true });
