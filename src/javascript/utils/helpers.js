export var isShiftPressed = false;
export var isCtrlPressed = false;

export function isHtmlElement(object) {
    return object instanceof HTMLElement;
}

export function initHelpers() {
    document.addEventListener('keydown', event => handleKeyDown(event));
    document.addEventListener('keyup', event => handleKeyUp(event));
}

export function onReady(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

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

export function retrieveLoginStatus() {
    let menu = document.getElementById('materialize-menu-dropdown');
    let menuItem = menu.innerText.split('\n')[4];
    if (menuItem === 'Login') {
        isLoggedIn = false;
        console.log(isLoggedIn);
    } else if (menuItem.includes('User')) {
        isLoggedIn = true;
        console.log(isLoggedIn);
    }
}