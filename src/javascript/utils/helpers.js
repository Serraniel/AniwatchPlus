export var isShiftPressed = false;
export var isCtrlPressed = false;

export function isHtmlElement(object) {
    return object instanceof HTMLElement;
}

export function initHelpers() {
    document.addEventListener('keydown', event => handleKeyDown(event));
    document.addEventListener('keyup', event => handleKeyUp(event));
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