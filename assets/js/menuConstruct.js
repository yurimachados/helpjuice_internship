import textTypes from "./textTypes.js";
import { setElementTextType } from "./elementMutations.js";
import { createPlaceholderObserver } from "./ensurePlaceholder.js";

const editableDiv = document.querySelector('.content-body-editable');
const optionsMenu = document.getElementById('options-menu');
const optionsUl = optionsMenu.querySelector('ul');
let awaitingNumberInput = false;
let menuClickFlag = null;

/**
 * Function to construct the menu options based on the text types
 * @returns {void}
 */
const constructMenuOptions = () => {
    const existingTextTypes = optionsUl.querySelectorAll('li');
    existingTextTypes.forEach(li => li.remove());

    Object.entries(textTypes).forEach(([index, { tag, placeholder, name }]) => {
        const menuItem = document.createElement('li');
        menuItem.classList.add('options-menu-item');
        if (index === '1') {
            menuItem.classList.add('first');
        };
        menuItem.setAttribute('data-tag', tag);
        menuItem.setAttribute('data-placeholder', placeholder);

        menuItem.innerHTML = `
            <img src="assets/svg/T.svg">
            <div>
                <h4>${name}</h4>
                <p>Shortcut: type # + space</p>
            </div>
        `;
        menuItem.addEventListener('click', () => {
            menuItems.forEach(item => item.classList.remove('selected'));
            menuItem.classList.add('selected');
            menuClickFlag = index;
            if (menuClickFlag !== null) {
                setElementTextType(menuClickFlag, lastElementLocation, lastElementText);
                menuClickFlag = null;
            }
            hideOptionsMenu();
        });

        optionsUl.appendChild(menuItem);
    });
    let filteredKeySpan = document.getElementById('filtered-key-count');
    if (filteredKeySpan) {
        filteredKeySpan.textContent = Object.keys(textTypes).length.toString(); // Correção aqui
    }
}


const hideOptionsMenu = () => {
    optionsMenu.style.display = 'none';
};

/**
 * Function to show the options menu
 * @returns {void}
 * @param {HTMLElement} currentElement - The current element
 * @param {string} preCommandText - The text before the command
 * @param {string} text - The text of the current element
 * @param {string} textType - The type of text
 * @param {number} currentId - The id of the current element
 */
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
 * function to observe the command input and trigger the command
 * @param {KeyboardEvent} e - The keyboard event
 * @param {HTMLElement} currentElement - The current element
 * @param {string} preCommandText - The text before the command
 * @param {HTMLElement} lastElementLocation - The last element location
 * @param {string} lastElementText - The last element text
 * @param {boolean} awaitingNumberInput - The flag for awaiting number input
 * @param {number} menuClickFlag - The flag for the menu click
 * @param {HTMLElement} editableDiv - The editable div
 * @param {HTMLElement} optionsMenu - The options menu
 * @param {HTMLElement} optionsUl - The options menu ul
 * @param {HTMLElement} menuItem - The menu item
 * @returns {void}
 */
let preCommandText = '';
let lastElementLocation = null;
let lastElementText = null;
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
        commandEnter(currentElement);
    }

    if (e.key === 'Backspace' && currentElement.textContent === '<br>') {
        currentElement.innerHTML = '';
    }

    if (e.key === '/') {
        lastElementLocation = currentElement;
        lastElementText = currentElement.textContent;
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
        setElementTextType(parseInt(e.key), currentElement, preCommandText);

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

/**
 * Function to create a new element after the current element
 * @param {HTMLElement} currentElement - The current element 
 * @param {number} currentId - The id of the current element 
 * @param {string} currentElementText - The text of the current element
 * @param {string} textType - The type of text to be created
 * @returns {void}
 */
const commandEnter = (currentElement) => {
    if (currentElement.nodeType === Node.TEXT_NODE) {
        currentElement = currentElement.parentElement;
    }

    if (!currentElement || !currentElement.classList.contains('content-text')) {
        console.warn('Current element is not a .content-text element.', currentElement);
        return;
    }

    let currentElementText = currentElement.innerHTML;

    if (currentElementText.trim() === '' || currentElementText === '<br>') {
        console.warn('Current element is empty. Cannot create a new element.');
        return
    }

    let textType = textTypes[3];
    let newElement = document.createElement(textType.tag);
    newElement.setAttribute('data-placeholder', textType.placeholder);

    let currentId = parseInt(currentElement.getAttribute('data-id'));
    const newId = (currentId + 1).toString();
    newElement.setAttribute('data-id', (newId));

    newElement.classList.add('content-text');

    currentElement.insertAdjacentElement('afterend', newElement);

    createPlaceholderObserver(newElement);
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

constructMenuOptions();
export { showOptionsMenu, hideOptionsMenu, observeCommand };