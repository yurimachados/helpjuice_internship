
import { observeCommand } from "./menuConstruct.js";
import { observeContentDiv } from "./ensureDivNotEmpty.js";
import { ensurePlaceholderBehavior } from "./ensurePlaceholder.js";


document.addEventListener('DOMContentLoaded', function () {
    const editableDiv = document.querySelector('.content-body-editable');

    observeContentDiv();
    ensurePlaceholderBehavior();

    const handleKeyDown = (event) => {
        observeCommand(event);
    };

    editableDiv.addEventListener('keydown', handleKeyDown);
});