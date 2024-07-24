const textTypes = {
    "Heading 1": { tag: "h1", placeholder: "Heading 1" },
    "Heading 2": { tag: "h2", placeholder: "Heading 2" },
    "bold": { tag: "strong", placeholder: "Bold" },
}

document.addEventListener('DOMContentLoaded', function () {
    const editableDiv = document.querySelector('.content-body-editable');
    const optionsMenu = document.querySelector('#options-menu');
    const optionsUl = optionsMenu.querySelector('ul');

    const showOptionsMenu = () => {
        const rect = editableDiv.getBoundingClientRect();
        optionsMenu.style.display = 'flex';
        optionsMenu.style.position = 'absolute';
        optionsMenu.style.left = `${rect.left}px`;
        optionsMenu.style.top = `${rect.bottom}px`;
        awaitingNumberInput = true;
    }

    const createNewElement = (textType) => {
        if (textTypes[textType]) {
            let tag = textTypes[textType].tag;
            let placeholder = textTypes[textType].placeholder;
            const newElement = document.createElement(tag);
            newElement.textContent = placeholder;
            editableDiv.appendChild(newElement);
            optionsMenu.style.display = 'none';
        } else {
            console.error('Invalid text type:', textType);
        }
    }

    const selectNewElementByIndex = (index) => {
        let optionsMenuItems = document.querySelectorAll('.options-menu-item');
        if (index >= 0 && index < optionsMenuItems.length) {
            const option = optionsMenuItems[index];
            const textTypeKey = option.querySelector('h4').textContent.trim();
            if (textTypes[textTypeKey]) { 
                createNewElement(textTypeKey);
            } else {
                console.error('Invalid option selected:', textTypeKey);
            }
        }
    }

    if (!optionsUl) {
        const createUl = document.createElement('ul');
        optionsMenu.appendChild(createUl);
    }

    const existingTextTypes = optionsUl.querySelectorAll('li');
    existingTextTypes.forEach(li => li.remove());

    Object.entries(textTypes).forEach(([optionText, { tag, placeholder }]) => {
        const menuItem = document.createElement('li');
        menuItem.classList.add('options-menu-item');

        menuItem.innerHTML = `
            <img src="assets/svg/T.svg">
            <div>
                <h4>${optionText}</h4>
                <p>Shortcut: type # + space</p>
            </div>
        `;
        menuItem.addEventListener('click', () => {
            createNewElement(optionText);
        });

        optionsUl.appendChild(menuItem);
    });

    
    let awaitingNumberInput = false;
    editableDiv.addEventListener('keydown', function (e) {
        if (e.key === '/') {
            if (optionsMenu) {
                showOptionsMenu();
            }
        } else if (awaitingNumberInput && !isNaN(e.key) && e.key !== ' ') {
            selectNewElementByIndex(parseInt(e.key) - 1);
            awaitingNumberInput = false
        } else {
            if (optionsMenu) {
                optionsMenu.style.display = 'none';
            }
            awaitingNumberInput = false;
        }
    });
});