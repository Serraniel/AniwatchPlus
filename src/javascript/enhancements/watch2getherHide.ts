import * as core from '../utils/aniwatchCore';
import * as helper from '../utils/helpers';
import { getGlobalConfiguration, SETTINGS_w2gAutotoggleHide } from '../configuration/configuration';
import { findPlayerElement } from "../enhancements/anilyr";

const PLAYER_ID = 'wPlayer';
let hidden: boolean;

export function init(): void {
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
}

function addAutohideListener(): void {
    let playerElement = findPlayerElement(PLAYER_ID);
    let hideButton: HTMLButtonElement = document.getElementsByClassName('no-margin md-button md-ink-ripple layout-align-center-center layout-row')[0] as HTMLButtonElement;
    if (helper.assigned(playerElement) && helper.assigned(hideButton)) {
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
