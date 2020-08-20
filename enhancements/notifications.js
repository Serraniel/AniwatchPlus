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
        let notificationCount = menuUserText.split("")[6];
        console.log(notificationCount);
        // If there are no notifications
        if (Number.isNaN(parseInt(notificationCount)) || typeof notificationCount === 'undefined') {
            console.warn("NaN or undefined");
            return ``; // Otherwise displayNotificationsInTitle() throws undefined again
        }
        // Notifications present
        else {
            return `(${notificationCount}) `;
        }
    }
}

function displayNotificationsInTitle() {
    console.log(__notificationCount);
    if (typeof __notificationCount === 'undefined') {
        console.error("NoTiFiCaTiOnCoUnT uNdEfInEd!");
    }
    else {
        document.title = __notificationCount + document.title;
    }
}
