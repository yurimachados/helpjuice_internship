import textTypes from "./textTypes.js";
import { setElementTextType } from "./elementMutations.js";

console.log('Menu importado')
const editableDiv = document.querySelector('.content-body-editable');
const optionsMenu = document.getElementById('options-menu');
const optionsUl = optionsMenu.querySelector('ul');
let awaitingNumberInput = false;

const constructMenuOptions = () => {
    const existingTextTypes = optionsUl.querySelectorAll('li');
    existingTextTypes.forEach(li => li.remove());

    Object.entries(textTypes).forEach(([index, { tag, placeholder }]) => {
        const menuItem = document.createElement('li');
        menuItem.classList.add('options-menu-item');
        menuItem.setAttribute('data-tag', tag);
        menuItem.setAttribute('data-placeholder', placeholder);

        menuItem.innerHTML = `
            <img src="assets/svg/T.svg">
            <div>
                <h4>${placeholder}</h4>
                <p>Shortcut: type # + space</p>
            </div>
        `;
        menuItem.addEventListener('click', () => {
            createNewElement(index, preCommandText);
            hideOptionsMenu();
        });

        optionsUl.appendChild(menuItem);
    });
    console.log('menu construido')
}

constructMenuOptions();

const hideOptionsMenu = () => {
    optionsMenu.style.display = 'none';
};

const showOptionsMenu = () => {
    setTimeout(() => {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        const topPosition = rect.bottom + window.scrollY;
        let leftPosition = rect.left + (rect.width / 2);
        if (leftPosition < 0) {
            leftPosition = 0;
        }

        optionsMenu.style.left = `${leftPosition}px`;
        optionsMenu.style.top = `${topPosition}px`;
        optionsMenu.style.display = 'flex';
        optionsMenu.style.position = 'absolute';
        awaitingNumberInput = true;
    }, 0);
}

/**
 * Function to observe commands and execute actions
 * 
 * @param {KeyboardEvent} e - The keyboard event
 * @returns {void}
 */
let preCommandText = '';
const observeCommand = (e) => {

    let currentSelection = window.getSelection().anchorNode;
    if (currentSelection.nodeType === Node.TEXT_NODE) {
        currentSelection = currentSelection.parentElement;
    }

    let currentElement = currentSelection;
    let currentDiv = currentSelection.parentElement;

    let commandActive = false;
    if (awaitingNumberInput) {
        commandActive = document.querySelector('.command-active');
    }

    if (currentDiv && currentDiv !== editableDiv && currentDiv.nodeName !== 'DIV') {
        currentDiv = currentElement.parentElement;
    }

    if (e.key === 'Enter') {
        e.preventDefault();
        console.log('enter')
        commandEnter(currentElement);
    }

    if (e.key === '/') {
        let text = currentElement.textContent;
        preCommandText = text;
        if (optionsMenu) {
            setTimeout(showOptionsMenu, 0);
        }
        if (currentElement && editableDiv.contains(currentElement)) {
            currentElement.classList.add('command-active');
        }
    } else if (awaitingNumberInput && !isNaN(e.key) && e.key !== ' ') {
        e.preventDefault();
        const contentText = currentDiv.querySelector('.content-text');
        setElementTextType(parseInt(e.key), contentText, preCommandText);

        if (commandActive) {
            commandActive.classList.remove('command-active');
        } else {
            let commandActive = document.querySelector('.command-active');
            if (!awaitingNumberInput && commandActive) {
                commandActive.classList.remove('command-active');
            }
        }
        awaitingNumberInput = false;
    } else {
        if (optionsMenu) {
            hideOptionsMenu();
        }
        if (currentDiv && editableDiv.contains(currentDiv) && currentDiv.classList.contains('command-active')) {
            currentDiv.classList.remove('command-active');
        }
        awaitingNumberInput = false;
    }
}

const commandEnter = (currentElement) => {
    if (currentElement.nodeType === Node.TEXT_NODE) {
        currentElement = currentElement.parentElement;
    }

    if (!currentElement || !currentElement.classList.contains('content-text')) {
        console.warn('Current element is not a .content-text element.', currentElement);
        return;
    }

    let currentElementText = currentElement.innerHTML;

    if (currentElementText === '' || currentElementText === '<br>') {
        console.warn('Current element is empty. Cannot create a new element.');
        return
    }

    let textType = textTypes[4];
    let newElement = document.createElement(textType.tag);
    newElement.setAttribute('data-placeholder', textType.placeholder);

    let currentId = parseInt(currentElement.getAttribute('data-id'));
    const newId = (currentId + 1).toString();
    newElement.setAttribute('data-id', (newId));

    newElement.classList.add('content-text');
    newElement.innerHTML = '<br>';

    currentElement.insertAdjacentElement('afterend', newElement);

    setTimeout(() => {
        newElement.focus();
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStart(newElement, 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    }, 0);
}

function simulateKeyDownArrow() {
    const event = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        code: 'ArrowDown',
        keyCode: 40,
        which: 40,
        bubbles: true
    });
    document.dispatchEvent(event);
}

export { showOptionsMenu, hideOptionsMenu, observeCommand };
// Path: assets/js/createElement.js
// Compare this snippet from assets/js/textTypes.js: