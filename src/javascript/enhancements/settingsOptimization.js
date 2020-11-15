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
    const DIRECTION_ATTRIBUTE = 'md-direction';

    let directionStr = tooltip.getAttribute(DIRECTION_ATTRIBUTE);

    if (directionStr === 'top') {
        tooltip.setAttribute(DIRECTION_ATTRIBUTE, 'right');        
    }
}