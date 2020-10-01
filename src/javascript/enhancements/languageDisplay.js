import * as core from '../utils/aniwatchCore';
import * as helper from '../utils/helpers';

export function init() {
    core.registerScript(node => {
        // run the scripts
        if (helper.isHtmlElement(node)) {
            updateLanguageDisplay(node)
        }
    }, "^/anime/[0-9]*$");
}

function updateLanguageDisplay(node) {
    const listNodeName = 'MD-LIST-ITEM';
    const boxNodeName = 'DIV';
    const boxClassName = 'card-margin';

    if (node.nodeName === listNodeName) {
        updateLanguageDisplayListMode(node);
    }
    else if (node.nodeName === boxNodeName && node.classList.contains(boxClassName)) {
        updateLanguageDisplayBoxMode(node);
    }
}

function updateLanguageDisplayListMode(node) {
    // last column with flags
    let col = node.querySelector('h3.layout-align-end-center');

    if (typeof col === 'undefined' || col.awpManipulated) {
        return;
    }

    doUpdateLanguageDisplay(col, false);
}

function updateLanguageDisplayBoxMode(node) {
    // last column with flags
    let col = node.querySelector('div.layout-align-end-start');

    if (typeof col === 'undefined' || col.awpManipulated) {
        return;
    }

    dopUpdateLanguageDisplay(col, true);
}


function dopUpdateLanguageDisplay(parent, isBoxedModed) {
    const listLangPrefix = 'ep.lang.';
    const boxLangPrefix = 'episodeObject.lang.';
    // aniwatch uses different prefixes in list und box mode :/
    let realLangPrefix = isBoxedModed ? boxLangPrefix : listLangPrefix;

    const dubSuffix = 'dub';
    const subSuffix = 'sub';

    const dubIcon = 'volume_up';
    const subIcon = 'closed_caption';
    const zeroWidthSpace = ''; // &#8203;

    let subs = [];
    let dubs = [];

    // find subs
    let subCols = parent.querySelectorAll('[ng-hide*="sub"]');
    subCols.forEach(element => {
        let langAttr = element.attributes['ng-hide'].value;
        let lang = langAttr.substring(langAttr.indexOf(realLangPrefix) + realLangPrefix.length, langAttr.indexOf(subSuffix));
        if (element.attributes['aria-hidden'].value == 'false') {
            subs.push(lang);
        }
    });

    // find dubs
    let dubCols = parent.querySelectorAll('[ng-hide*="dub"]');
    dubCols.forEach(element => {
        let langAttr = element.attributes['ng-hide'].value;
        let lang = langAttr.substring(langAttr.indexOf(realLangPrefix) + realLangPrefix.length, langAttr.indexOf(dubSuffix));
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
                dubIconDiv.innerText = dubIcon;
            }
            // add dummy with 24px for correct presentation
            else {
                dubIconDiv.style.height = '24px';
                dubIconDiv.innerText = zeroWidthSpace;
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
            subIconDiv.innerText = subIcon;
        }
        // add dummy with 24px for correct presentation
        else {
            subIconDiv.style.height = '24px';
            subIconDiv.innerText = zeroWidthSpace;
        }

        subDiv.appendChild(subIconDiv);
        subs.forEach(lang => {
            let langIcon = document.createElement('i');
            langIcon.classList.add('flag', `flag-${lang}`, 'mg-all-1');
            subDiv.appendChild(langIcon);
        });

        colDiv.appendChild(subDiv);

        cols.push(colDiv);
        iconsRequired = false;
    }

    if (dubs.length > 0) {
        dubs.forEach(lang => {
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
                dubIconDiv.innerText = dubIcon;
            }
            // add dummy with 24px for correct presentation
            else {
                dubIconDiv.style.height = '24px';
                dubIconDiv.innerText = zeroWidthSpace;
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
                    subIconDiv.innerText = subIcon;
                }
                // add dummy with 24px for correct presentation
                else {
                    subIconDiv.style.height = '24px';
                    subIconDiv.innerText = zeroWidthSpace;
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
        div.style.borderRight = '1px solid rgba(155,155,155, 0.2)';
    })

    parent.querySelectorAll('.layout-column').forEach(div => {
        div.style.paddingLeft = '2px';
        div.style.paddingRight = '2px';
    })

    parent.awpManipulated = true;
}
