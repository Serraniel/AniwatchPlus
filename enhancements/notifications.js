runAfterLoad(() => {
    displayNotificationsInTitle();
}, ".*");

function displayNotificationsInTitle(){
    let menu = document.getElementById('materialize-menu-dropdown');
    let menuDropdowns = Array.from(menu.querySelectorAll('ul.dropdown')).slice(-1)[0];
    let notificationText = menuDropdowns.innerText.split("  ")[3];
    document.title = notificationText.split(" ")[1] + ' ' + document.title;
}