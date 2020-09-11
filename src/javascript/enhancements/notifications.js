import * as core from '../utils/aniwatchCore';
import * as helper from '../utils/helpers';

export function init() {
    core.runAfterLoad(() => {
        updateNotificationsInTitle();
    }, ".*");

    core.runAfterPathnameChange(() => {
        console.log('CHANGE')
        updateNotificationsInTitle();
    }, ".*");
}

function getNotificationCount() {
    if (core.isLoggedIn()) {
        let menuUserText = document.getElementById('materialize-menu-dropdown').innerText.split('\n')[4];
        console.log(menuUserText);
        let notificationCount = menuUserText.match(/\d+/)?.[0] ?? 0;
        console.log(notificationCount);
        return notificationCount;
    } else {
        return 0;
    }
}

function updateNotificationsInTitle() {
    let count = getNotificationCount();

    if (helper.assigned(count) && count > 0) {
        document.title = `(${count}) ${document.title}`;
    }
}