import Color from 'color';
import { getGlobalConfiguration, SETTINGS_websiteOptimizeFontColors } from '../configuration/configuration';
import * as core from '../utils/aniwatchCore';
import * as helper from '../utils/helpers';

const BADGE_CLASS = 'label';

export function init() {
    getGlobalConfiguration().getProperty(SETTINGS_websiteOptimizeFontColors, value => {
        if (value) {
            core.runAfterLoad(() => {
                checkRunColorOptimization(document.documentElement);
            }, ".*");

            core.runAfterLocationChange(() => {
                checkRunColorOptimization(document.documentElement);
            }, ".*");

            core.registerScript(node => {
                checkRunColorOptimization(node);
            }, ".*");
        }
    });
}

function checkRunColorOptimization(node) {

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
}

function optimizeFontColorsBadges(badge) {
    let colorStr = window.getComputedStyle(badge, null).getPropertyValue('background-color');

    if (colorStr.length > 0) { // some elements do not have a computed background color
        let color = new Color(colorStr)
        if (color.isLight()) {
            badge.classList.add('awp-fontColor-dark')
        }
    }
}