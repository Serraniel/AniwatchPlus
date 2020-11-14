import Color from 'color';
import { getGlobalConfiguration, SETTINGS_websiteOptimizeFontColors } from '../configuration/configuration';
import * as core from '../utils/aniwatchCore';
import * as helper from '../utils/helpers';

const BADGE_CLASS = 'label';

export function init() {
    getGlobalConfiguration().getProperty(SETTINGS_websiteOptimizeFontColors, value => {
        if (value) {            
            core.registerScript(node => {
                console.log(node);
                // run the scripts
                if (helper.isHtmlElement(node)) {

                    if (node.classList.contains(BADGE_CLASS)) {
                        optimizeFontColorsBadges(node);
                    }
                    else {
                        node.querySelectorAll(`.${BADGE_CLASS}`).forEach(element => {
                            optimizeFontColorsBadges(element);
                        });
                    }
                }
            }, ".*");
        }
    });
}

function optimizeFontColorsBadges(badge) {
    let color = window.getComputedStyle(badge, null).getPropertyValue('background-color');
    let c = new Color(color)
    if (c.isLight()) {
        badge.classList.add('awp-fontColor-dark')
    }
}