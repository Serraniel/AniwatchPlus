registerScript(node => {
    // run the scripts
    if (isHtmlElement(node)) {
        updateLanguageDisplay(node)
    }
}, "^/anime/[0-9]*$");

function updateLanguageDisplay(node) {
    const langPrefix = 'ep.lang.';
    const dubSuffix = 'dub';
    const subSuffix = 'sub';

    const dubIcon = 'volume_up';
    const subIcon = 'closed_caption';
    const zeroWidthSpace = '&#8203;';

    let listItems = document.querySelectorAll('md-list-item');

    listItems.forEach(item => {
        // last column with flags
        let col = item.querySelector('h3.layout-align-end-center');

        if (col.eaManipulated) {
            return;
        }

        let subs = [];
        let dubs = [];

        // find subs
        subCols = col.querySelectorAll('[ng-hide*="sub"]');
        subCols.forEach(element => {
            let langAttr = element.attributes['ng-hide'].value;
            let lang = langAttr.substring(langAttr.indexOf(langPrefix) + langPrefix.length, langAttr.indexOf(subSuffix));
            subs[lang] = element.ariaHidden;
        });

        // find dubs
        dubCols = col.querySelectorAll('[ng-hide*="dub"]');
        dubCols.forEach(element => {
            let langAttr = element.attributes['ng-hide'].value;
            let lang = langAttr.substring(langAttr.indexOf(langPrefix) + langPrefix.length, langAttr.indexOf(dubSuffix));
            if (element.ariaHidden) {
                subs.push(lang);
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
                japIcon.classList.add('flag flag-jp');
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
                langIcon.classList.add('flag', `flag-${lang}`);
                subDiv.appendChild(langIcon);
            });

            colDiv.appendChild(subDiv);

            cols.push(colDiv);
            iconsRequired = false;
        }

        if (dubs > 0) {
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
                langIcon.classList.add('flag', `flag-${lang}`);
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

        cols.forEach(div => {
            col.appendChild(div);
        });

        col.eaManipulated = true;
    });
}