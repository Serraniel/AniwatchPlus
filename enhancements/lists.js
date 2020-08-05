registerScript(node => {
    // run the scripts
    if (isHtmlElement(node)) {
        addListHorizontalSeparators(node)
    }
}, ".*");

function addListHorizontalSeparators(node) {
    const targetTagName = 'MD-LIST-ITEM'; // tagName is upper case

    let updateFunc = item => {
        // add border as horizontal seperator 
        item.style.borderBottom = "1px solid rgba(155,155,155, 0.2)";
    }

    // are we target tag?
    if (node.tagName === targetTagName) {
        updateFunc(node);
    } else {
        // find items -> all 
        let requestItems = node.querySelectorAll('md-list-item');

        // update borders
        requestItems.forEach(item => {
            updateFunc(item);
        });
    }
}