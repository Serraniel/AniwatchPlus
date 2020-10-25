import * as core from '../utils/aniwatchCore';
import * as helper from '../utils/helpers';
import { v4 as uuidv4 } from 'uuid';

export function init() {
    // UPS // runAfterLoad is not what we want...wait for runAfterLocationChange....
    core.runAfterLoad(() => {
        manipulateChatInput();
    }, "^/watch2gether/.*$");
}

function manipulateChatInput() {    
    let textarea = document.querySelector('.chat-input textarea');

    // avoid duplicate registration
    if (typeof textarea.dataset.charCounterId !== 'undefined') {
        return;
    }
}

function addCharCounter(textarea) {
    let chatDiv = textarea.parentElement.parentElement; // div with chat input and controls
    let controlRow = chatDiv.children[1]; // row with controls
    let btn = controlRow.querySelector('button'); // find send button

    let counterSpan = document.createElement('span'); // create span for counter
    counterSpan.classList.add('awp-w2g-chatCounter');

    // id and "connection"
    let counterId = `awp-${v4()}`
    counterSpan.id = counterId;
    textarea.dataset.charCounterId = counterId;

    btn.parentElement.inserBefore(counterSpan, btn); // and insert in front of the button

    textarea.addEventListener('keypress keyup', () => {        
        let current = textarea.value.length;
        let max = textarea.maxLength;

        counterSpan.innerText = `${current} / ${max}`;

        // animation if at max
        counterSpan.classList.toggle('awp-w2g-chatCounter-max', current >= max);
    });
}