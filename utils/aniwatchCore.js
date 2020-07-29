let __scripts = [];
let __afterLoadScripts = [];

function registerScript(func, pattern = '.*') {
    __scripts.push({ "function": func, "pattern": pattern });
}

function runScripts(node) {
    __scripts.forEach(script => {
        if (window.location.pathname.match(script.pattern)) {
            script.function(node);
        }
    });
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

function runAfterLoad(func, pattern = '.*') {
    __afterLoadScripts.push({ "function": func, "pattern": pattern });
}

document.addEventListener("DOMContentLoaded", event => awaitPageLoaded(), false);

function awaitPageLoaded() {
    let preLoader = document.getElementById('preloader');

    if (typeof preLoader === 'undefined') {
        return;
    }

    let loop = setInterval(() => {
        if (preLoader.style.display === "none") {
            clearInterval(loop);

            __afterLoadScripts.forEach(script => {
                if (window.location.pathname.match(script.pattern)) {
                    script.function();
                }
            })
        }
    }, 100);
}