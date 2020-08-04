registerScript(node => {
    // run the scripts
    if (isHtmlElement(node)) {
        updateLanguageDisplay(node)
    }
}, "^/anime/[0-9]*$");

function updateLanguageDisplay(node) {

}