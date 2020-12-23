import Color from 'color';
import { getGlobalConfiguration, SETTINGS_websiteOptimizeFontColors } from '../configuration/configuration';
import * as core from '../utils/aniwatchCore';
import * as helper from '../utils/helpers';

const BADGE_CLASS = 'label';
const DARKCOLOR_CLASS = 'awp-fontColor-dark';
const __observedBadges = [];

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
            tryRegisterObserverForBadge(node);
            optimizeFontColorsBadges(node);
        }
        else {
            node.querySelectorAll(`.${BADGE_CLASS}`).forEach(element => {
                tryRegisterObserverForBadge(element);
                optimizeFontColorsBadges(element);
            });
        }
    }
}

function tryRegisterObserverForBadge(badge) {
    // some badges change there color via late loading so we also have to observe the classlist
    // example: Navigating from a list to an anime -> "Currently Airing" late loads the color badge
    // this only happens when navigating from a list, direct loading works

    if (__observedBadges.indexOf(badge) >= 0) {
        return;
    }

    let obsever = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // prevent recursive calls when our class is added / removed            
            if ((mutation.oldValue?.indexOf(DARKCOLOR_CLASS) ?? -1 ^ mutation.target?.classList?.indexOf(DARKCOLOR_CLASS) ?? -1) === 0) {
                return;
            }
            else {
                optimizeFontColorsBadges(mutation.target);
            }
        });
    });

    obsever.observe(badge, {
        attributes: true,
        attributeFilter: ['class'],
        attributeOldValue: true,
    });

    __observedBadges.push(badge);
}

function optimizeFontColorsBadges(badge) {
    let colorStr = window.getComputedStyle(badge, null).getPropertyValue('background-color');

    // some elements do not have a computed background color
    if (colorStr.length > 0) {
        let color = new Color(colorStr)
        badge.classList.toggle(DARKCOLOR_CLASS, color.isLight());
    }
}