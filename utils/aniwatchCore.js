let __scripts = [];

function registerScript(func){
    __scripts.push(func);
}

function runScripts(){
    console.log("RUN");
    __scripts.forEach(script => script());
}

function awaitPageLoaded(){
    let preLoader = document.getElementById('preloader');
    
    let loop = setInterval(() => {
        if(preLoader.style.display==="none"){
            clearInterval(loop);
            runScripts();
        }
    }, 100);
}

// RUN AT INITIALIZATION
window.addEventListener("hashchange", event => runScripts(), false);
document.addEventListener("DOMContentLoaded", event => awaitPageLoaded(), false);

document.querySelector('.main-section').