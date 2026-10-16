import { MainWindow } from './main_window.js';

const mainWindow = new MainWindow({
    menubar: document.getElementById('menubar'),
    toolbar: document.getElementById('toolbar'),
    canvas: document.getElementById('canvas'),
    status: document.getElementById('status')
});
mainWindow.onCreate();
