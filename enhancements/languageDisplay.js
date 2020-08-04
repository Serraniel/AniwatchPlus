registerScript(node => {
    // run the scripts
    if (isHtmlElement(node)) {
        updateLanguageDisplay(node)
    }
}, ".*");

function updateLanguageDisplay(node) {

}