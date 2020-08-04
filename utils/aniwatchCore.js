let __scripts = [];
let __afterLoadScripts = [];
let __afterPopstateScripts = [];
let __afterPathnameChangeScripts = [];

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

function runAfterPathnameChange(func, pattern = '.*') {
    __afterPathnameChangeScripts.push({ "function": func, "pattern": pattern});
}

let locationPath = location.pathname;
let __loop = setInterval(() => {
    if (locationPath != location.pathname) {
        locationPath = location.pathname;
        awaitPathnameChange();
    }
}, 100);

function awaitPathnameChange() {
    let preLoader = document.getElementById('preloader');

    if (typeof preLoader === 'undefined') {
        return;
    }

    let loop = setInterval(() => {
        if (preLoader.style.display === "none") {
            clearInterval(loop);
            __afterPathnameChangeScripts.forEach(script => {
                if (window.location.pathname.match(script.pattern)) {
                    script.function();
                }
            })
        }
    }, 100);
}
