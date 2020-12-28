import Color from 'color';
import { getGlobalConfiguration, SETTINGS_websiteOptimizeFontColors } from '../configuration/configuration';
import * as core from '../utils/aniwatchCore';
import * as helper from '../utils/helpers';

const BADGE_CLASS = 'label';
const DARKCOLOR_CLASS = 'awp-fontColor-dark';
const __observedBadges = [];

export function init(): void {
    getGlobalConfiguration().getProperty(SETTINGS_websiteOptimizeFontColors, value => {
        if (value) {
            core.runAfterLoad(() => {
                checkRunColorOptimization(document.documentElement);
            }, ".*");

            core.runAfterLocationChange(() => {
                checkRunColorOptimization(document.documentElement);
            }, ".*");

            core.registerScript((node: Node) => {
                if (node instanceof Element) {
                    checkRunColorOptimization(node);
                }
            }, ".*");
        }
    });
}

function checkRunColorOptimization(node: Element): void {
    // run the scripts
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

function tryRegisterObserverForBadge(badge: Node): void {
    // some badges change there color via late loading so we also have to observe the classlist
    // example: Navigating from a list to an anime -> "Currently Airing" late loads the color badge
    // this only happens when navigating from a list, direct loading works

    if (__observedBadges.indexOf(badge) >= 0) {
        return;
    }

    let obsever = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // prevent recursive calls when our class is added / removed     
            if (mutation.target instanceof Element) {
                // TODO: Validate if that still works
                if ((mutation.oldValue?.indexOf(DARKCOLOR_CLASS) ?? -1 ^ (mutation.target?.classList?.contains(DARKCOLOR_CLASS) ?? false ? 0 : -1)) === 0) {
                    return;
                }
                else {
                    optimizeFontColorsBadges(mutation.target);
                }
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

function optimizeFontColorsBadges(badge: Element): void {
    let colorStr = window.getComputedStyle(badge, null).getPropertyValue('background-color');

    // some elements do not have a computed background color
    if (colorStr.length > 0) {
        let color = new Color(colorStr)
        badge.classList.toggle(DARKCOLOR_CLASS, color.isLight());
    }
}