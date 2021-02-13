import * as core from '../utils/aniwatchCore';
import { v4 as uuidv4 } from 'uuid';
import { getGlobalConfiguration, SETTINGS_w2gDisplayCharacterCounter, SETTINGS_w2gAutotoggleHide, SETTINGS_w2gAutoscrollToUnseen } from '../configuration/configuration';
import { assigned } from '../utils/helpers';
import { findPlayerElement } from "../enhancements/anilyr";

const PLAYER_ID = 'wPlayer';
let hidden: boolean;

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

    getGlobalConfiguration().getProperty(SETTINGS_w2gAutotoggleHide, value => {
        if (value) {
            core.runAfterLoad(() => {
                addAutohideListener();
            }, "^/watch2gether/.*$");

            core.runAfterLocationChange(() => {
                addAutohideListener();
            }, "^/watch2gether/.*$");
        }
    });

    getGlobalConfiguration().getProperty(SETTINGS_w2gAutoscrollToUnseen, value => {
        if (value) {
            core.runAfterLoad(() => {
                let element = findSearchResults();
                if (assigned(element)) {
                    scrollSearchResults(element);
                }
            }, "^/watch2gether/.*$");

            core.runAfterLocationChange(() => {
                let element = findSearchResults();
                if (assigned(element)) {
                    scrollSearchResults(element);
                }
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

function addAutohideListener(): void {
    let playerElement = findPlayerElement(PLAYER_ID);
    let hideButton: HTMLButtonElement = document.getElementsByClassName('no-margin md-button md-ink-ripple layout-align-center-center layout-row')[0] as HTMLButtonElement;
    if (assigned(playerElement) && assigned(hideButton)) {
        if (hideButton.textContent.includes('HIDE')) {
            hidden = false;
        } else if (hideButton.textContent.includes('SHOW')) {
            hidden = true;
        }
        playerElement.addEventListener('play', fn => {
            if (!hidden) {
                hideButton.click();
                hidden = !hidden;
            }
        })
        playerElement.addEventListener('pause', fn => {
            if (hidden) {
                hideButton.click();
                hidden = !hidden;
            }
        })
    }
}

function scrollSearchResults(searchRes: Element): void {
    let observer = new MutationObserver(mutations => {
        let scrollTarget = searchRes.querySelector('md-list-item:not(.animelist-completed):not(.animelist-completed-add)') as HTMLElement;

        if (assigned(scrollTarget)) {
            // The node isn´t in its correct position directly when it´s added so we wait a small bit of time before we start scrolling.
            // Also works for long loading lists which need more time to load than we wait (for example One Piece).
            window.setTimeout(() => {
                // scroll container to episode first
                searchRes.scrollTop = scrollTarget.offsetTop;

                // then scroll page to episode if neccessarry
                scrollTarget.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }, 500);
        }
    });

    observer.observe(searchRes, {
        childList: true,
    });
}

function findSearchResults(): Element {
    return document.querySelector('.search-results .ep-view');
}
