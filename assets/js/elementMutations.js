
import { hideOptionsMenu } from "./menuConstruct.js";
import textTypes from "./textTypes.js";
import { createPlaceholderObserver } from "./ensurePlaceholder.js";

/**
 * Function to set the text type of an element based on the index of the text type
 * @param {number} textTypeIndex - The index of the text type
 * @param {HTMLElement} element - The element to set the text type on
 * @param {string} preCommandText - The text before the command
 * @returns {void}
 */
const setElementTextType = (textTypeIndex, element, preCommandText) => {
    const textType = textTypes[textTypeIndex];

    if (textType) {
        let text = checkText(preCommandText);
        let newElement = document.createElement(textType.tag);

        newElement.setAttribute('data-placeholder', textType.placeholder);
        newElement.classList.add('content-text');
        if(text === false){
            newElement.classList.add('placeholder');
        } else {
            newElement.textContent = text;
        }

        createPlaceholderObserver(newElement);
        console.log('element', element)
        console.log('newElement', newElement)
        element.parentNode.replaceChild(newElement, element);
        setTimeout(() => {
            newElement.focus();
            const range = document.createRange();
            const sel = window.getSelection();
            range.setStart(newElement, 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }, 0);
        hideOptionsMenu();        
    } else {
        console.error('Invalid text type:', textType);
        hideOptionsMenu();
    }
}

// Function to check if the text is empty
const checkText = (text) => {
    if(text.trim() === '') {
        return false;
    } else {
        return text;
    }
}

export { setElementTextType };