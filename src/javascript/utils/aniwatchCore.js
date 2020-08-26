let __scripts = [];
let __afterLoadScripts = [];

export function registerScript(func, pattern = '.*') {
    __scripts.push({ "function": func, "pattern": pattern });
}

export function runScripts(node) {
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

function findPreloader() {
    return document.getElementById('preloader');
}

export function runAfterLoad(func, pattern = '.*') {
    let preloader = findPreloader();
    if (typeof preloader !== undefined && preloader.style.display !== "none") {
        __afterLoadScripts.push({ "function": func, "pattern": pattern });
    } else {
        func();
    }
}

document.addEventListener("DOMContentLoaded", event => awaitPageLoaded(), false);

function awaitPageLoaded() {
    let preLoader = findPreloader();

    let runScripts = () => {
        __afterLoadScripts.forEach(script => {
            if (window.location.pathname.match(script.pattern)) {
                script.function();
            }
        });
    };

    if (typeof preLoader === 'undefined') {
        runScripts();
        return;
    }

    let loop = setInterval(() => {
        if (preLoader.style.display === "none") {
            clearInterval(loop);

            runScripts();
        }
    }, 100);
}