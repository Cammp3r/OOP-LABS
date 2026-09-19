import { createModal } from './utils.js';

const PICTURE_NUMBER = ['№1', '№2', '№3', '№4', '№5', '№6'];

export function startRobota2(setOutput) {
    const optionsHTML = PICTURE_NUMBER
        .map(group => `<option value="${group}">${group}</option>`)
        .join('');

    const modal = createModal({
        title: 'Малюнки - Вибір малюнка',
        bodyHTML: `<select id="groupList" size="6" style="width:100%">${optionsHTML}</select>`,
        buttons: [
            { label: 'Так', onClick: () => {
                const select = modal.body.querySelector('#groupList');
                const selectedGroup = select.value;
                modal.close();
                setOutput(`Малюнки: обрано малюнок - ${selectedGroup}`);
            } },
            { label: 'Відміна', onClick: () => modal.close() }
        ]
    });
}

