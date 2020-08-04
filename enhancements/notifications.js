let __notificationCount = '';

runAfterLoad(() => {
    __notificationCount = getNotificationCount();
    displayNotificationsInTitle();
}, ".*");

runAfterPathnameChange(() => {
    displayNotificationsInTitle();
}, ".*");

function getNotificationCount() {
    let menu = document.getElementById('materialize-menu-dropdown');
    let menuDropdowns = Array.from(menu.querySelectorAll('ul.dropdown')).slice(-1)[0];
    let notificationText = menuDropdowns.innerText.split("  ")[3];
    return notificationText.split(" ")[1] + ' ';
}

function displayNotificationsInTitle(){
    document.title = __notificationCount + document.title;
}
