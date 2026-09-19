export function createModal({ title, bodyHTML, buttons }) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const dialog = document.createElement('div');
    dialog.className = 'modal';
    dialog.innerHTML = `
        <h3>${title}</h3>
        <div class="modal-body">${bodyHTML}</div>
        <div class="modal-buttons"></div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    const buttonsContainer = dialog.querySelector('.modal-buttons');
    buttons.forEach(({ label, onClick }) => {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.addEventListener('click', onClick);
        buttonsContainer.appendChild(btn);
    });

    return {
        body: dialog.querySelector('.modal-body'),
        close: () => overlay.remove()
    };
}
