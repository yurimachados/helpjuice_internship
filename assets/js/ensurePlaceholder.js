/**
 * Ensure placeholder behavior for content text elements 
 * @returns {void}
 * @export
 */
export function ensurePlaceholderBehavior(){
    const elements = document.querySelectorAll('.content-text');

    if (elements) {
        elements.forEach((element) => {
            createPlaceholderObserver(element);
        });
    }
}


/**
 * Function to create a MutationObserver for a content text element
 * @param {HTMLElement} element - The content text element
 * @returns {void}
 * @export
 */
export function createPlaceholderObserver (element) {
    checkAndTogglePlaceholder(element);

    const observer = new MutationObserver(() => {
        checkAndTogglePlaceholder(element);
        checkBr(element);
    });

    const config = { childList: true, subtree: true, characterData: true };

    observer.observe(element, config);
}

/**
 * Function to check if the element is empty and toggle the placeholder class
 * @param {HTMLElement} element - The element to check
 * @returns {void}
 */
const checkAndTogglePlaceholder = (element) => {
    if (element.textContent.trim() === '') {
        element.classList.add('placeholder');
    } else {
        element.classList.remove('placeholder');
    }
};

/**
 * Function to check if the element has br tags and remove them
 * @param {HTMLElement} element - The element to check
 * @returns {void}
 */
const checkBr = (element) => {
    let brs = element.querySelectorAll('br');
    if(brs){
        brs.forEach((br) => {
            br.remove();
        });
    }
}