const { assigned } = require("../utils/helpers")

class StorageProviderChromium {

    storeData(key, value, callback) {
    }

    getData(key, defaultValue, callback) {
    }

    getStorage() {
        if (assigned(chrome.storage.sync)) {
            return chrome.storage.sync;
        }

        return chrome.storage.local;
    }
}


class StorageProviderFirefox {

    storeData(key, value, callback) {
    }

    getData(key, defaultValue, callback) {
    }

    getStorage() {
    }
}

let __storageProvieder = undefined;

function createStorageProvider() {
    // chrome based browser
    if (assigned(chrome?.app)) {
        __storageProvieder = new StorageProviderChromium();
    }
    // firefox
    else {
        __storageProvieder = new StorageProviderFirefox();
    }

}

export function globalStorageProvider() {
    if (!assigned(__storageProvieder)) {
        createStorageProvider();
    }

    return __storageProvieder;
}