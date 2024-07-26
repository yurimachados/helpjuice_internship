# Helpjuice Internship Project

### Description

For this project, I recreated a functional prototype based on a Figma design provided by Helpjuice. The main objective was to build a Notion-like editor that focuses on the H1 heading component, allowing users to write anywhere and convert their content into H1. The application is deployed on railway and accessible online for easy testing.

[Project Link](https://yurihelpjuiceproject.up.railway.app/)

### Technologies Used

* **JavaScript (Vanilla)**: Used to add interactivity and handle user inputs.
* **Node.js**: Used to run the server and serve the application.
* **HTML and CSS**: Used to create the structure and style the application.

### Explanation

- Inicialization: The `DOMContentLoaded` event ensures the script runs after the DOM is fully loaded.The script starts running once the DOM is fully loaded.
- Editable Div: The script selects the `.content-body-editable` div where users will write their content. The `contentEditable` attribute turns the div into a functional text editor, allowing users to input and modify text directly.
- **Text Types**: The `textTypes` object defines various text types and their attributes:

* `observeContentDiv()`: Ensures that the content div is properly initialized and managed.
* `ensurePlaceholderBehavior()`: Manages placeholder behavior to enhance user experience.
* `observeCommand(event)`: Captures input events and manages commands triggered by user actions.
* `setElementTextType` : This function changes the type of a text element based on the specified index. It replaces the current element with a new one of the desired type (e.g., `h1`, `h2`, `p`), managing placeholders and text content.

*This setup ensures that the application mimics the behavior and appearance of the Figma prototype, providing a seamless user experience.  More details aboute the application logic can be found in the functions documentation.*

### Deploy

Install dependencies and start ths node server

```
npm run prod
```
