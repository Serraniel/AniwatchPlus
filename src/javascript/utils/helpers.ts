export var isShiftPressed: boolean = false;
export var isCtrlPressed: boolean = false;

export function isHtmlElement(object: any) {
    return object instanceof HTMLElement;
}

export function initHelpers(): void {
    document.addEventListener('keydown', event => handleKeyDown(event));
    document.addEventListener('keyup', event => handleKeyUp(event));
}

export function onReady(fn: () => void) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

export function assigned(obj: any): boolean {
    return !(typeof obj === 'undefined' || obj === null);
}

function handleKeyDown(event: KeyboardEvent) {
    handleKeyToggle(event, true);
}

function handleKeyUp(event: KeyboardEvent) {
    handleKeyToggle(event, false);
}

function handleKeyToggle(event: KeyboardEvent, isPressed: boolean) {
    if (event.key === 'Shift') {
        isShiftPressed = isPressed;
    } else if (event.key === 'Control') {
        isCtrlPressed = isPressed;
    }
}

export function findTextNodes(baseNode: Node): Array<Node> {
    if (!assigned(baseNode)) {
        baseNode = document.documentElement;
    }

    let walker = document.createTreeWalker(baseNode, NodeFilter.SHOW_TEXT, null, false);
    let node;
    let results = [];
    while (node = walker.nextNode()) {
        results.push(node);
    }

    return results;
}