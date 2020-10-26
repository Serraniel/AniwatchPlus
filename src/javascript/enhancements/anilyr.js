import * as core from '../utils/aniwatchCore';
import * as helper from '../utils/helpers';

const SCREENSHOT_TOOLTIP_ID = 'anilyr-screenshots-tooltip';

export function init() {
    core.registerScript(node => {
        if (helper.isHtmlElement(node) && node.id === SCREENSHOT_TOOLTIP_ID) {
            observeScreenshotTooltip(node);
        }
    }, "^/anime/[0-9]*/[0-9]*$");
}

function observeScreenshotTooltip(tooltip) {
    let observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            
        });
    });

    observer.observe(tooltip, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ['style'],        
    });
}