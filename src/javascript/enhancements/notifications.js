import * as core from '../utils/aniwatchCore';
import * as helper from '../utils/helpers';

export function init() {
    core.runAfterLoad(() => {
        updateNotificationsInTitle();
    }, ".*");

    core.runAfterLocationChange(() => {
        updateNotificationsInTitle();
    }, ".*");
}

function getNotificationCount() {
    if (core.isLoggedIn()) {
        let menus = document.getElementById('materialize-menu-dropdown').innerText.split('\n');

        // On some pages there is an issue if the website is loaded using them as entry point (eg. /Search). 
        // They don´t have their menu build completly directly and the above code does not return the "User" element :/
        // If this happens the menu is splitted into many more (~20) items than only 5. 
        // So if there are more, we just try again later.
        // Additionally, if the element is there correctly it´s not updated with the notification count directly, so we wait a bit longer before retrying.
        if (menus.length > 5) {
            setTimeout(() => {
                updateNotificationsInTitle();
            }, 2000);

            return undefined;
        }

        let menuUserText = menus[4];
        let notificationCount = menuUserText.match(/\d+/)?.[0] ?? 0;
        return notificationCount;
    } else {
        return 0;
    }
}

function updateNotificationsInTitle() {
    let count = getNotificationCount();

    if (helper.assigned(count) && count > 0) {
        // document.title is updated after the event is triggered, so we delay our title update by a reasonable time
        setTimeout(() => {
            document.title = `(${count}) ${document.title}`;
        }, 100);
    }
}