
import { hideOptionsMenu } from "./menuConstruct.js";
import textTypes from "./textTypes.js";

const selectNewElementByIndex = (index) => {
    // console.log('Selecting new element by index:', index);
    let optionsMenuItems = document.querySelectorAll('.options-menu-item');
    if (index >= 0 && index <= optionsMenuItems.length) {
        createNewElement(index, preCommandText);
        hideOptionsMenu();
    } else {
        hideOptionsMenu();
    }
}

/**
 * Function to create a new element in the editable div
 * 
 * @param {string} textType - The type of text to create
 * 
 * @returns {void}
 * 
 * todo: verify if the selection is inside a div, if not, create a new div
 */
const setElementTextType = (textTypeIndex, element, preCommandText) => {
    // console.log('Creating new element:', index);
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

        element.parentNode.replaceChild(newElement, element);
        newElement.focus();
        hideOptionsMenu()
        // let tag = textType.tag;
        // let placeholder = textType.placeholder;
        
        // // console.log(text)

        // let contentDiv = document.getElementsByClassName('command-active')[0];
        // contentDiv.classList.add('content-div');
        // // let newElement = document.createElement(tag);

        // contentDiv.textContent = '';
        // contentDiv.appendChild(newElement);
        
    } else {
        console.error('Invalid text type:', textType);
    }
}

const checkText = (text) => {

    if(text.trim() === '') {
        return false;
    } else {
        return text;
    }
}

export { selectNewElementByIndex, setElementTextType };