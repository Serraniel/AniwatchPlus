import * as core from '../utils/aniwatchCore';
import { v4 as uuidv4 } from 'uuid';
import { getGlobalConfiguration, SETTINGS_w2gDisplayCharacterCounter } from '../configuration/configuration';
import { assigned } from '../utils/helpers';

export function init(): void {
    getGlobalConfiguration().getProperty(SETTINGS_w2gDisplayCharacterCounter, value => {
        if (value) {
            core.runAfterLoad(() => {
                manipulateChatInput();
            }, "^/watch2gether/.*$");
            core.runAfterLocationChange(() => {
                manipulateChatInput();
            }, "^/watch2gether/.*$");
        }
    });
}

function manipulateChatInput(): void {
    let textarea = document.querySelector('.chat-input textarea') as HTMLTextAreaElement;

    // avoid duplicate registration
    if (assigned(textarea.dataset.charCounterId)) {
        return;
    }

    addCharCounter(textarea);
}

function addCharCounter(textarea: HTMLTextAreaElement): void {
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
        updateCharCounter(textarea, charCounterSpan)
    });
}

function updateCharCounter(textarea: HTMLTextAreaElement, charCounterSpan: HTMLSpanElement): void {
    const SHAKE_CLASS = 'awp-w2g-chatCounter-max';

    let current = textarea.value.length;
    let max = textarea.maxLength;

    charCounterSpan.innerText = `${current} / ${max}`;

    // animation if at max
    if (current >= max && !charCounterSpan.classList.contains(SHAKE_CLASS)) {
        charCounterSpan.classList.add(SHAKE_CLASS);

        // remove css class after animation finished, so it can be restarted again
        setTimeout(() => {
            charCounterSpan.classList.remove(SHAKE_CLASS);
        }, 200);
    }
}