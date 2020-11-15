import { getGlobalConfiguration, SETTINGS_websiteHideUnusedTabs, SETTINGS_websiteOptimizeListAppearance } from '../configuration/configuration';
import * as core from '../utils/aniwatchCore';
import * as helper from '../utils/helpers';

export function init() {
    getGlobalConfiguration().getProperty(SETTINGS_websiteHideUnusedTabs, value => {
        // if disabled, add class to avoid our css optimizations
        if (!value) {
            let disableFunc = node => {
                if (helper.isHtmlElement(node)) {
                    let disableNode = node => {
                        node.classList.add('awp-hide-unused-disabled')
                    }

                    if (node.tagName === 'MD-TAB-ITEM') {
                        disableNode(node);
                    }
                    else {
                        node.querySelectorAll('md-tab-item').forEach(node => disableNode(node));
                    }
                }
            };

            core.registerScript(node => {
                console.log(node);
                node.querySelectorAll('*').forEach(e => console.log(e));
                disableFunc(node);
            }, ".*");

            core.runAfterLoad(() => {
                disableFunc(document.body);
            }, ".*");
        }
    });

    getGlobalConfiguration().getProperty(SETTINGS_websiteOptimizeListAppearance, value => {
        // if disabled, add class to avoid our css optimizations
        if (!value) {
            let disableFunc = node => {
                if (helper.isHtmlElement(node)) {
                    let disableNode = node => {
                        node.classList.add('awp-list-disabled')
                    }

                    if (node.tagName === 'MD-LIST-ITEM') {
                        disableNode(node);
                    }
                    else {
                        node.querySelectorAll('md-list-item').forEach(node => disableNode(node));
                    }
                }
            }

            core.registerScript(node => {
                disableFunc(node);
            }, ".*");

            core.runAfterLoad(() => {
                disableFunc(document.body);
            }, ".*");
        }
    });
}