import { createModal } from './utils.js';

export function showWindow2(setOutput) {
    return new Promise((resolve) => {
        const modal = createModal({
            title: 'Інструкція - Вікно 2',
            bodyHTML: '<p>Натисніть "Так", щоб підтвердити, або "< Назад", щоб повернутись.</p>',
            buttons: [
                { label: '< Назад', onClick: () => { modal.close(); resolve('window1'); } },
                { label: 'Так', onClick: () => {
                    modal.close();
                    setOutput('Інструкція: підтверджено у другому вікні (Так)');
                    resolve(null);
                } },
                { label: 'Відміна', onClick: () => { modal.close(); resolve(null); } }
            ]
        });
    });
}
