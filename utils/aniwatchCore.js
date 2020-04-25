function executeAfterPreload(func){
    let preLoader = document.getElementById('preloader');
    
    let loop = setInterval(() => {
        if(preLoader.style.display==="none"){
            clearInterval(loop);
            func();
        }
    }, 100);
}