import { getGlobalConfiguration, SETTINGS_animeLanguageDisplay } from '../configuration/configuration';
import * as core from '../utils/aniwatchCore';
import * as helper from '../utils/helpers';

const MANIPULATED_ATTR_NAME = 'awpManipulated';

export function init(): void {
    getGlobalConfiguration().getProperty(SETTINGS_animeLanguageDisplay, value => {
        if (value) {
            core.registerScript((node: Node) => {
                // run the scripts
                if (node instanceof Element) {
                    updateLanguageDisplay(node)
                }
            }, "^/anime/[0-9]*$");
        }
    });
}

function updateLanguageDisplay(node: Element): void {
    const LIST_NODE_NAME = 'MD-LIST-ITEM';
    const BOX_NODE_NAME = 'DIV';
    const BOX_CLASS_NAME = 'card-margin';

    if (node.nodeName === LIST_NODE_NAME) {
        updateLanguageDisplayListMode(node);
    }
    else if (node.nodeName === BOX_NODE_NAME && node.classList.contains(BOX_CLASS_NAME)) {
        updateLanguageDisplayBoxMode(node);
    }
}

function updateLanguageDisplayListMode(node: Element): void {
    // last column with flags
    let col = node.querySelector('h3.layout-align-end-center');

    if (!helper.assigned(col) || col.hasAttribute(MANIPULATED_ATTR_NAME)) {
        return;
    }

    doUpdateLanguageDisplay(col, false);
}

function updateLanguageDisplayBoxMode(node: Element): void {
    // last column with flags
    let col = node.querySelector('div.layout-align-end-start');

    if (!helper.assigned(col) || col.hasAttribute(MANIPULATED_ATTR_NAME)) {
        return;
    }

    doUpdateLanguageDisplay(col, true);
}


function doUpdateLanguageDisplay(parent: Element, isBoxedModed: boolean): void {
    const LIST_LANG_PREFIX = 'ep.lang.';
    const BOX_LANG_PREFIX = 'episodeObject.lang.';
    // aniwatch uses different prefixes in list und box mode :/
    let realLangPrefix = isBoxedModed ? BOX_LANG_PREFIX : LIST_LANG_PREFIX;

    const DUB_SUFFIX = 'dub';
    const SUB_SUFFIX = 'sub';

    const DUB_ICON = 'volume_up';
    const SUB_ICON = 'closed_caption';
    const ZERO_WIDTH_SPACE_CHARACTER = ''; // &#8203;

    let subs: Array<string> = [];
    let dubs: Array<string> = [];

    // find subs
    let subCols = parent.querySelectorAll('[ng-hide*="sub"]');
    subCols.forEach((element: Element) => {
        let langAttr = element.attributes['ng-hide'].value;
        let lang = langAttr.substring(langAttr.indexOf(realLangPrefix) + realLangPrefix.length, langAttr.indexOf(SUB_SUFFIX));
        if (element.attributes['aria-hidden'].value == 'false') {
            subs.push(lang);
        }
    });

    // find dubs
    let dubCols = parent.querySelectorAll('[ng-hide*="dub"]');
    dubCols.forEach((element: Element) => {
        let langAttr = element.attributes['ng-hide'].value;
        let lang = langAttr.substring(langAttr.indexOf(realLangPrefix) + realLangPrefix.length, langAttr.indexOf(DUB_SUFFIX));
        if (element.attributes['aria-hidden'].value == 'false') {
            dubs.push(lang);
        }
    });

    // build output html
    let iconsRequired = true;
    let cols = [];

    // subs first;
    if (subs.length > 0) {
        let colDiv = document.createElement('div');
        colDiv.setAttribute('layout', 'column');
        colDiv.classList.add('layout-column');

        // do we have dubs?
        if (dubs.length > 0) {
            let dubDiv = document.createElement('div');
            dubDiv.setAttribute('layout', 'row');
            dubDiv.setAttribute('layout-align', 'start center');
            dubDiv.classList.add('layout-align-start-center', 'layout-row');

            let dubIconDiv = document.createElement('i');
            if (iconsRequired) {
                dubIconDiv.classList.add('material-icons', 'mr-3');
                dubIconDiv.innerText = DUB_ICON;
            }
            // add dummy with 24px for correct presentation
            else {
                dubIconDiv.style.height = '24px';
                dubIconDiv.innerText = ZERO_WIDTH_SPACE_CHARACTER;
            }

            dubDiv.appendChild(dubIconDiv);

            let japIcon = document.createElement('i');
            japIcon.classList.add('flag', 'flag-jp', 'mg-all-1');
            dubDiv.appendChild(japIcon);

            colDiv.appendChild(dubDiv);
        }

        // do the subs
        let subDiv = document.createElement('div');
        subDiv.setAttribute('layout', 'row');
        subDiv.setAttribute('layout-align', 'start center');
        subDiv.classList.add('layout-align-start-center', 'layout-row');

        let subIconDiv = document.createElement('i');
        if (iconsRequired) {
            subIconDiv.classList.add('material-icons', 'mr-3');
            subIconDiv.innerText = SUB_ICON;
        }
        // add dummy with 24px for correct presentation
        else {
            subIconDiv.style.height = '24px';
            subIconDiv.innerText = ZERO_WIDTH_SPACE_CHARACTER;
        }

        subDiv.appendChild(subIconDiv);
        subs.forEach((lang: string) => {
            let langIcon = document.createElement('i');
            langIcon.classList.add('flag', `flag-${lang}`, 'mg-all-1');
            subDiv.appendChild(langIcon);
        });

        colDiv.appendChild(subDiv);

        cols.push(colDiv);
        iconsRequired = false;
    }

    if (dubs.length > 0) {
        dubs.forEach((lang: string) => {
            let colDiv = document.createElement('div');
            colDiv.setAttribute('layout', 'column');
            colDiv.classList.add('layout-column');

            let dubDiv = document.createElement('div');
            dubDiv.setAttribute('layout', 'row');
            dubDiv.setAttribute('layout-align', 'start center');
            dubDiv.classList.add('layout-align-start-center', 'layout-row');

            let dubIconDiv = document.createElement('i');
            if (iconsRequired) {
                dubIconDiv.classList.add('material-icons', 'mr-3');
                dubIconDiv.innerText = DUB_ICON;
            }
            // add dummy with 24px for correct presentation
            else {
                dubIconDiv.style.height = '24px';
                dubIconDiv.innerText = ZERO_WIDTH_SPACE_CHARACTER;
            }

            dubDiv.appendChild(dubIconDiv);

            let langIcon = document.createElement('i');
            langIcon.classList.add('flag', `flag-${lang}`, 'mg-all-1');
            dubDiv.appendChild(langIcon);

            colDiv.appendChild(dubDiv);

            // do we have subs?
            if (subs.length > 0) {
                let subDiv = document.createElement('div');
                subDiv.setAttribute('layout', 'row');
                subDiv.setAttribute('layout-align', 'start center');
                subDiv.classList.add('layout-align-start-center', 'layout-row');

                let subIconDiv = document.createElement('i');
                if (iconsRequired) {
                    subIconDiv.classList.add('material-icons', 'mr-3');
                    subIconDiv.innerText = SUB_ICON;
                }
                // add dummy with 24px for correct presentation
                else {
                    subIconDiv.style.height = '24px';
                    subIconDiv.innerText = ZERO_WIDTH_SPACE_CHARACTER;
                }

                subDiv.appendChild(subIconDiv);
                colDiv.appendChild(subDiv);
            }

            cols.push(colDiv);
            iconsRequired = false;
        });
    }

    parent.innerHTML = '';
    cols.forEach(div => {
        parent.appendChild(div);
    });

    parent.querySelectorAll('.layout-column:not(:last-child)').forEach(div => {
        if (div instanceof HTMLElement) {
            div.style.borderRight = '1px solid rgba(155,155,155, 0.2)';
        }
    })

    parent.querySelectorAll('.layout-column').forEach(div => {
        if (div instanceof HTMLElement) {
            div.style.paddingLeft = '2px';
            div.style.paddingRight = '2px';
        }
    })

    parent.setAttribute('awpManipulated', String(true));
}
