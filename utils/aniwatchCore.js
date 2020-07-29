let __scripts = [];

function registerScript(func) {
    __scripts.push(func);
}

function runScripts(node) {
    __scripts.forEach(script => script(node));
}

let observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
            runScripts(mutation.addedNodes[i]);
        }
    });
});

observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true,
    attributes: true
});