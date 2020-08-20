var isShiftPressed = false;
var isCtrlPressed = false;
var isLoggedIn = false;

function isHtmlElement(object) {
    return object instanceof HTMLElement;
}

document.addEventListener('keydown', event => handleKeyDown(event));
document.addEventListener('keyup', event => handleKeyUp(event));

function handleKeyDown(event) {
    handleKeyToggle(event, true);
}

function handleKeyUp(event) {
    handleKeyToggle(event, false);
}

function handleKeyToggle(event, isPressed) {
    if (event.key === 'Shift') {
        isShiftPressed = isPressed;
    } else if (event.key === 'Control') {
        isCtrlPressed = isPressed;
    }
}

function retrieveLoginStatus() {
    let menu = document.getElementById('materialize-menu-dropdown');
    let menuItem = menu.innerText.split('\n')[4];
    if (menuItem === 'Login') {
        isLoggedIn = false;
        console.log(isLoggedIn);
    }
    else if (menuItem.includes('User')) {
        isLoggedIn = true;
        console.log(isLoggedIn);
    }
}
