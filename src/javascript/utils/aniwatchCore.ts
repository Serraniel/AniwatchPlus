import * as helper from './helpers';

type ScriptCallback = () => void;
type NodeScriptCallback = (node: Node) => void;

type ScriptObj = {
    function: ScriptCallback,
    pattern: string
}

type NodeScriptObj = {
    function: NodeScriptCallback,
    pattern: string
}

/* SCRIPT LOGICS */
let __scripts: Array<NodeScriptObj> = [];
let __afterLoadScripts: Array<ScriptObj> = [];
let __afterLocationChangeScripts: Array<ScriptObj> = [];

export function initCore(): void {
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

    runAfterLoad(() => {
        let loadingBar = document.getElementById('enable-ani-cm');
        let loadingBarObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                // enable-ani-cm node changes from display:none to display:block after loading
                if (mutation.oldValue.includes('display: none')) {
                    __afterLocationChangeScripts.forEach(script => {
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

export function registerScript(func: NodeScriptCallback, pattern: string = '.*'): void {
    __scripts.push({ function: func, pattern: pattern });
}

export function runScripts(node: Node): void {
    __scripts.forEach(script => {
        if (window.location.pathname.match(script.pattern)) {
            script.function(node);
        }
    });
}

function findPreloader(): HTMLElement {
    return document.getElementById('preloader');
}

export function runAfterLoad(func: ScriptCallback, pattern: string = '.*'): void {
    let preloader = findPreloader();
    if (typeof preloader !== undefined && preloader.style.display !== "none") {
        __afterLoadScripts.push({ function: func, pattern: pattern });
    } else {
        func();
    }
}

function awaitPageLoaded(): void {
    let preLoader = findPreloader();

    let runScripts = () => {
        __afterLoadScripts.forEach(script => {
            if (window.location.pathname.match(script.pattern)) {
                script.function();
            }
        });
    };

    if (!helper.assigned(preLoader)) {
        runScripts();
        return;
    }

    let loop = window.setInterval(() => {
        if (preLoader.style.display === "none" && document.readyState === 'complete') {
            window.clearInterval(loop);

            runScripts();
        }
    }, 100);
}

/* PATHNAME LOGIC */
export function runAfterLocationChange(func: ScriptCallback, pattern: string = '.*'): void {
    __afterLocationChangeScripts.push({ function: func, pattern: pattern });
}

/* LOGIN LOGIC */
export function isLoggedIn(): boolean {
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