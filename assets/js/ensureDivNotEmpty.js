
import { createPlaceholderObserver } from "./ensurePlaceholder.js";

/**
 * Function to ensure the content div is not empty and has a placeholder
 * @returns {void}
 */
const ensureContentDiv = () => {
    const contentBodyEditable = document.querySelector('.content-body-editable');
    if (contentBodyEditable) {
        let contentDiv = contentBodyEditable.querySelector('.content-div');
        if (!contentDiv) {
            contentDiv = document.createElement('div');
            contentDiv.className = 'content-div';

            const p = document.createElement('p');
            p.setAttribute('data-placeholder', 'Type / for blocks, @ to link docs or people');
            p.setAttribute('data-id', '1');
            p.className = 'content-text placeholder';
            // p.innerHTML = '<br>';
            contentDiv.appendChild(p);

            createPlaceholderObserver(p);
            contentBodyEditable.appendChild(contentDiv);
        }
    }
};

/**
 * Function to observe the content div and ensure it is not empty
 * and has a placeholder when it is empty
 * @returns {void}
 */
export function observeContentDiv() {
    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
            if (mutation.type === 'childList') {
                ensureContentDiv();
            }
        });
    });

    const contentBodyEditable = document.querySelector('.content-body-editable');
    if (contentBodyEditable) {
        observer.observe(contentBodyEditable, {
            childList: true,
            subtree: true 
        });
        ensureContentDiv();
    }
}