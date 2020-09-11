import * as core from '../utils/aniwatchCore';
import * as helper from '../utils/helpers';

let __notificationCount = '';

export function init() {
    core.runAfterLoad(() => {
        retrieveLoginStatus();
        __notificationCount = getNotificationCount();
        displayNotificationsInTitle();
    }, ".*");

    core.runAfterPathnameChange(() => {
        displayNotificationsInTitle();
    }, ".*");
}

function getNotificationCount() {
    if (core.isLoggedIn()) {
        let menuUserText = document.getElementById('materialize-menu-dropdown').innerText.split('\n')[4];
        let notificationCount = menuUserText.split('')[6];
        // If there are no notifications
        if (Number.isNaN(parseInt(notificationCount)) || !helper.assigned(notificationCount)) {
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
    if (!helper.assigned(__notificationCount)) {
        console.error("NoTiFiCaTiOnCoUnT uNdEfInEd!");
    } else {
        document.title = __notificationCount + document.title;
    }
}