import { getGlobalConfiguration, SETTINGS_settingsEnhanceTooltips } from '../configuration/configuration';
import * as core from '../utils/aniwatchCore';
import * as helper from '../utils/helpers';

const TOOLTIP_TAG_NAME = 'MD-TOOLTIP';

export function init() {
    getGlobalConfiguration().getProperty(SETTINGS_settingsEnhanceTooltips, value => {
        if (value) {
            core.registerScript(node => {
                // run the scripts
                if (helper.isHtmlElement(node)) {
                    if (node.tagName === TOOLTIP_TAG_NAME) {
                        changeTooltipDirection(node);
                    }
                    else {
                        node.querySelectorAll(TOOLTIP_TAG_NAME).forEach(tooltip => changeTooltipDirection(tooltip));
                    }
                }
            }, "^/profile/[0-9]*$");
        }
    });
}

function changeTooltipDirection(tooltip) {
    // setting direction to right and changing classes to right don´t fix the position so we have to set it manually to the fix values:

    // find div which belongs to the tooltip:
    let div = document.querySelector(`[aria-label="${tooltip.innerText}"]`);
    if (helper.assigned(div)) {
        // for completness change the attributes and classes at first
        tooltip.setAttribute('md-direction', 'right');
        tooltip.classList.replace('md-origin-top', 'md-origin-right')

        // getting bounding rect
        let divBounds = div.getBoundingClientRect();

        console.debug(divBounds) // you´ll need this if they unluckily change their css or anything
        // set new position
        tooltip.style.left = `${divBounds.right + 0}px`;
        tooltip.style.top = `${divBounds.top + 18}px`; // don´t ask why but aligning it to the divs top will place it above the div and 18px seem to be a working offset...


        // they also will help debugging if they change something unlucky
        console.debug(tooltip);
        console.debug(tooltip.style.left);
        console.debug(tooltip.style.top);
        console.debug('---------')
    }
}