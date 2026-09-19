import { showWindow1 } from './module1_1.js';
import { showWindow2 } from './module1_2.js';
import { startRobota2 } from './module2.js';

const output = document.getElementById('output');
const setOutput = (text) => { output.textContent = text; };

async function startRobota1() {
    let current = 'window1';

    while (true) {
        if (current === 'window1') {
            current = await showWindow1();
        } else if (current === 'window2') {
            current = await showWindow2(setOutput);
        }

        if (current === null) {
            break;
        }
    }
}

document.getElementById('btnRobota1').addEventListener('click', startRobota1);
document.getElementById('btnRobota2').addEventListener('click', () => startRobota2(setOutput));
