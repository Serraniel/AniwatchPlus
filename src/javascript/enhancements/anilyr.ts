import { getGlobalConfiguration, SETTINGS_playerAutoplayAfterScreenshot } from '../configuration/configuration';
import * as core from '../utils/aniwatchCore';
import * as helper from '../utils/helpers';

const SCREENSHOT_TOOLTIP_ID = 'anilyr-screenshots-tooltip';
const PLAYER_ID = 'player';

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
}

function observeScreenshotTooltip(tooltip: HTMLElement): void {
    let observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // Switched to invisible
            if (!mutation.oldValue.includes('display: none') && helper.isHtmlElement(mutation.target) && (mutation.target as HTMLElement).style.display == 'none') {
                let playerElement = findPlayerElement();
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

function findPlayerElement(): HTMLVideoElement {
    let playerCandidate = document.getElementById(PLAYER_ID);
    if (playerCandidate instanceof HTMLVideoElement) {
        return playerCandidate;
    }

    return undefined;
}

function resumePlayer(player: HTMLVideoElement) {
    player.play();
}