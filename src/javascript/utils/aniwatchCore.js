import * as helper from './helpers';

/* SCRIPT LOGICS */
let __scripts = [];
let __afterLoadScripts = [];
let __afterPathnameChangeScripts = [];

export function initCore() {
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

    // patchBrowser();
    // window.addEventListener('locationchange', (event) => handleLocationChanged(event));

    runAfterLoad(() => {
        let loadingBar = document.getElementById('enable-ani-cm');
        let loadingBarObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                // enable-ani-cm node changes from display:none to display:block after loading
                if (mutation.oldValue.includes('display: none')) {
                    __afterPathnameChangeScripts.forEach(script => {
                        if (window.location.pathname.match(script.pattern)) {
                            script.function();
                        }
                    });
                }
            })
        });

        loadingBarObserver.observe(loadingBar, {
            attributes: true,
            attributeOldValue: true,
            attributeFilter: ['style'],
        });

    }, '.*')

    helper.onReady(() => awaitPageLoaded());
}

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

/* PATHNAME LOGIC */
export function runAfterPathnameChange(func, pattern = '.*') {
    __afterPathnameChangeScripts.push({ "function": func, "pattern": pattern });
}

function handleLocationChanged(event) {
    __afterPathnameChangeScripts.forEach(script => {
        if (window.location.pathname.match(script.pattern)) {
            script.function();
        }
    });
}

function patchBrowser() {
    // patches several browser functions to dispatch a "locationchange" event
    // as an extension is not allowed to override these functions we have to inject this as a script tag into the head
    let scriptContent = `history.pushState = (func => function pushState() {
        let result = func.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));

        return result;
    })(history.pushState);

    history.replaceState = (func => function replaceState() {
        let result = func.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
        return result;
    })(history.replaceState);

    window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('locationchange'))
    });`

    let head = document.getElementsByTagName("head")[0];
    let newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.innerHTML = scriptContent;
    head.appendChild(newScript);
}

/* LOGIN LOGIC */
export function isLoggedIn() {
    let menu = document.getElementById('materialize-menu-dropdown');
    let result = true;

    menu.innerText.split('\n').forEach(item => {
        if (item === 'Login') {
            result = false;
            return;
        }
    });

    return result;
}