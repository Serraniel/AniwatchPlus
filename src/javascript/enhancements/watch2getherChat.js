import * as core from '../utils/aniwatchCore';
import * as helper from '../utils/helpers';
import { v4 as uuidv4 } from 'uuid';

export function init() {
    // UPS // runAfterLoad is not what we want...wait for runAfterLocationChange....
    core.runAfterLocationChange(() => {
        manipulateChatInput();
    }, "^/watch2gether/.*$");
}

function manipulateChatInput() {
    let textarea = document.querySelector('.chat-input textarea');

    // avoid duplicate registration
    if (typeof textarea.dataset.charCounterId !== 'undefined') {
        return;
    }

    addCharCounter(textarea);
}

function addCharCounter(textarea) {
    let chatDiv = textarea.parentElement.parentElement; // div with chat input and controls
    let controlRow = chatDiv.children[1]; // row with controls
    let btn = controlRow.querySelector('button'); // find send button

    let charCounterSpan = document.createElement('span'); // create span for counter
    charCounterSpan.classList.add('awp-w2g-chatCounter');

    // id and "connection"
    let counterId = `awp-${uuidv4()}`
    charCounterSpan.id = counterId;
    textarea.dataset.charCounterId = counterId;

    btn.parentElement.insertBefore(charCounterSpan, btn); // and insert in front of the button
    updateCharCounter(textarea, charCounterSpan);

    textarea.addEventListener('keyup', () => {
        console.log('TRIGGER')
        updateCharCounter(textarea, charCounterSpan)
    });
}

function updateCharCounter(textarea, charCounterSpan) {
    const SHAKE_CLASS = 'awp-w2g-chatCounter-max';

    let current = textarea.value.length;
    let max = textarea.maxLength;

    charCounterSpan.innerText = `${current} / ${max}`;

    // animation if at max
    // this need to be delayed because removing and adding it too fast again will prevent the browsers to replay the animation
    if (current >= max && !charCounterSpan.classList.contains(SHAKE_CLASS)) {
        charCounterSpan.classList.add(SHAKE_CLASS);

        setTimeout(() => {
            charCounterSpan.classList.remove(SHAKE_CLASS);
        }, 200);
    }
}