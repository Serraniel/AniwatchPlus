let __scripts = [];

function registerScript(func) {
    __scripts.push(func);
}

let observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
            __scripts.forEach(script => script(mutation.addedNodes[i]));
        }
    });
});

observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true
});