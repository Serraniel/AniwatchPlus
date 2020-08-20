let __notificationCount = '';

runAfterLoad(() => {
    retrieveLoginStatus();
    __notificationCount = getNotificationCount();
    displayNotificationsInTitle();
}, ".*");

runAfterPathnameChange(() => {
    displayNotificationsInTitle();
}, ".*");

function getNotificationCount() {
    if (isLoggedIn) {
        let menuUserText = document.getElementById('materialize-menu-dropdown').innerText.split('\n')[4];
        return menuUserText.split(" ")[1] + ' ';
    }
}

function displayNotificationsInTitle(){
    document.title = __notificationCount + document.title;
}
