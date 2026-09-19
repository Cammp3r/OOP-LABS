import { createModal } from './utils.js';

export function showWindow1() {
    return new Promise((resolve) => {
        const modal = createModal({
            title: 'Інструкція - Вікно 1',
            bodyHTML: '<p>Натисніть "Далі >", щоб перейти до наступного вікна.</p>',
            buttons: [
                { label: 'Далі >', onClick: () => { modal.close(); resolve('window2'); } },
                { label: 'Відміна', onClick: () => { modal.close(); resolve(null); } }
            ]
        });
    });
}
