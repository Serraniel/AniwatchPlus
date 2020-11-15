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
                }
            }, "^/profile/[0-9]*\?tab=6$");
        }
    });
}

