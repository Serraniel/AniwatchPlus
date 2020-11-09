import { getGlobalConfiguration, SETTINGS_playerAutoplayAfterScreenshot } from '../configuration/configuration';
import * as core from '../utils/aniwatchCore';
import * as helper from '../utils/helpers';

const SCREENSHOT_TOOLTIP_ID = 'anilyr-screenshots-tooltip';
const PLAYER_ID = 'player';

export function init() {
    getGlobalConfiguration().getProperty(SETTINGS_playerAutoplayAfterScreenshot, value => {
        if (value) {
            core.registerScript(node => {
                if (helper.isHtmlElement(node) && node.id === SCREENSHOT_TOOLTIP_ID) {
                    observeScreenshotTooltip(node);
                }
            }, "^/anime/[0-9]*/[0-9]*$");
        }
    });
}

function observeScreenshotTooltip(tooltip) {
    let observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // Switched to invisible
            if (!mutation.oldValue.includes('display: none') && mutation.target.style.display == 'none') {
                let player = findPlayer();
                if (typeof player !== 'undefined') {
                    resumePlayer(player);
                }
            }
        });
    });

    observer.observe(tooltip, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ['style'],
    });
}

function findPlayer() {
    const PLAYER_TAG_NAME = 'VIDEO'; // tagName gives UpperCase

    let playerCandidate = document.getElementById(PLAYER_ID);
    if (playerCandidate.tagName === PLAYER_TAG_NAME) {
        return playerCandidate;
    }

    return undefined;
}

function resumePlayer(player) {
    player.play();
}