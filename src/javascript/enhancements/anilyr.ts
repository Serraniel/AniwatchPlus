import { getGlobalConfiguration,
    SETTINGS_playerAutoplayAfterScreenshot,
    SETTINGS_playerAutopauseAfterFocusLost,
    SETTINGS_playerAutoplayAfterFocusGain } from '../configuration/configuration';
import * as core from '../utils/aniwatchCore';
import * as helper from '../utils/helpers';

const SCREENSHOT_TOOLTIP_ID = 'anilyr-screenshots-tooltip';
const PLAYER_ID = 'player';
let resumePlayerOnVisible: boolean;

export function init(): void {
    getGlobalConfiguration().getProperty(SETTINGS_playerAutoplayAfterScreenshot, value => {
        if (value) {
            core.registerScript((node: Node) => {
                let element = node as HTMLElement;
                if (helper.assigned(element) && element.id === SCREENSHOT_TOOLTIP_ID) {
                    observeScreenshotTooltip(element);
                }
            }, "^/anime/[0-9]*/[0-9]*$");
        }
    });

    getGlobalConfiguration().getProperty(SETTINGS_playerAutopauseAfterFocusLost, value => {
        if (value) {
            core.registerScript((node: Node) => {
                window.addEventListener('visibilitychange', observeTabFocus, false);
            }, "^/anime/[0-9]*/[0-9]*$");
        }
    });

    getGlobalConfiguration().getProperty(SETTINGS_playerAutoplayAfterFocusGain, value => {
        resumePlayerOnVisible = value;
    });
}

function observeScreenshotTooltip(tooltip: HTMLElement): void {
    let observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // Switched to invisible
            if (!mutation.oldValue.includes('display: none') && helper.isHtmlElement(mutation.target) && (mutation.target as HTMLElement).style.display == 'none') {
                let playerElement = findPlayerElement(PLAYER_ID);
                if (helper.assigned(playerElement)) {
                    resumePlayer(playerElement);
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


function observeTabFocus(): void {
    let docState = document.visibilityState;
    let playerElement = findPlayerElement(PLAYER_ID);
    if (docState === 'hidden') {
        if (helper.assigned(playerElement)) {
            pausePlayer(playerElement);
        }
    }
    else if (docState === 'visible' && resumePlayerOnVisible) {
        if (helper.assigned(playerElement)) {
            resumePlayer(playerElement);
        }
    }
}

export function findPlayerElement(id: string): HTMLVideoElement {
    let playerCandidate = document.getElementById(id);
    if (playerCandidate instanceof HTMLVideoElement) {
        return playerCandidate;
    }

    return undefined;
}

function resumePlayer(player: HTMLVideoElement) {
    player.play();
}

function pausePlayer(player: HTMLVideoElement) {
    player.pause()
}