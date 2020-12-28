import { getGlobalConfiguration, SETTINGS_websiteHideUnusedTabs, SETTINGS_websiteOptimizeListAppearance } from '../configuration/configuration';
import * as core from '../utils/aniwatchCore';

export function init(): void {
    getGlobalConfiguration().getProperty(SETTINGS_websiteHideUnusedTabs, value => {
        // if disabled, add class to avoid our css optimizations
        if (!value) {
            let disableFunc = (node: Element) => {
                let disableNode = (node: Element) => {
                    node.classList.add('awp-hide-unused-disabled')
                }

                if (node.tagName === 'MD-TAB-ITEM') {
                    disableNode(node);
                }
                else {
                    node.querySelectorAll('md-tab-item').forEach(node => disableNode(node));
                }
            };

            core.registerScript(node => {
                if (node instanceof Element) {
                    disableFunc(node);
                }
            }, ".*");

            core.runAfterLoad(() => {
                disableFunc(document.body);
            }, ".*");
        }
    });

    getGlobalConfiguration().getProperty(SETTINGS_websiteOptimizeListAppearance, value => {
        // if disabled, add class to avoid our css optimizations
        if (!value) {
            let disableFunc = (node: Element) => {
                let disableNode = (node: Element) => {
                    node.classList.add('awp-list-disabled')
                }

                if (node.tagName === 'MD-LIST-ITEM') {
                    disableNode(node);
                }
                else {
                    node.querySelectorAll('md-list-item').forEach(node => disableNode(node));
                }
            }

            core.registerScript(node => {
                if (node instanceof Element) {
                    disableFunc(node);
                }
            }, ".*");

            core.runAfterLoad(() => {
                disableFunc(document.body);
            }, ".*");
        }
    });
}