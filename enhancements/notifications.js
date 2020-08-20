let __notificationCount = '';

runAfterLoad(() => {
    __notificationCount = getNotificationCount();
    displayNotificationsInTitle();
}, ".*");

runAfterPathnameChange(() => {
    displayNotificationsInTitle();
}, ".*");

function getNotificationCount() {
    let menuUserText = document.getElementById('materialize-menu-dropdown').innerText.split('\n')[4];
    return menuUserText.split(" ")[1] + ' ';
}

function displayNotificationsInTitle(){
    document.title = __notificationCount + document.title;
}
