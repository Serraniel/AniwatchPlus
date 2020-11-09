import { getGlobalConfiguration, SETTINGS_websiteShowNotificationsCountInTab } from '../configuration/configuration';
import * as core from '../utils/aniwatchCore';
import * as helper from '../utils/helpers';

export function init() {
    getGlobalConfiguration().getProperty(SETTINGS_websiteShowNotificationsCountInTab, value => {
        if (value) {
            core.runAfterLoad(() => {
                updateNotificationsInTitle();
            }, ".*");

            core.runAfterLocationChange(() => {
                updateNotificationsInTitle();
            }, ".*");
        }
    });
}

function getNotificationCount() {
    if (core.isLoggedIn()) {
        let menuUserText = document.getElementById('materialize-menu-dropdown').innerText.split('\n')[4];
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