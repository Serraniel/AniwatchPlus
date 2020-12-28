const { assigned } = require("../utils/helpers")

export type ConfigurationStorageBooleanCallback = (value: boolean) => void;

export interface ICustomBrowserStorageProvider {
    setDataAsBoolean(key: string, value: boolean): void;
    getDataAsBoolean(key: string, defaultValue: boolean, callback: ConfigurationStorageBooleanCallback): void;
}

class StorageProviderChromium implements ICustomBrowserStorageProvider {

    setDataAsBoolean(key: string, value: boolean): void {
        let obj = {};
        obj[key] = value;

        this.getStorage().set(obj);
    }

    getDataAsBoolean(key: string, defaultValue: boolean, callback: ConfigurationStorageBooleanCallback): void {
        this.getStorage().get(key, items => {
            if (assigned(items) && assigned(items[key])) {
                callback(items[key]);
            }
            else {
                callback(defaultValue);
            }
        })
    }

    private getStorage(): chrome.storage.StorageArea {
        if (assigned(chrome.storage.sync)) {
            return chrome.storage.sync;
        }

        return chrome.storage.local;
    }
}


class StorageProviderFirefox implements ICustomBrowserStorageProvider {

    setDataAsBoolean(key: string, value: boolean): void {
        let obj = {};
        obj[key] = value;

        this.getStorage().set(obj);
    }

    getDataAsBoolean(key: string, defaultValue: boolean, callback: ConfigurationStorageBooleanCallback): void {
        let promise = this.getStorage().get(key);

        promise.then(items => {
            if (assigned(items) && assigned(items[key])) {
                callback(items[key] as boolean);
            }
            else {
                callback(defaultValue);
            }
        });
    }

    private getStorage(): browser.storage.StorageArea {
        if (assigned(browser.storage.sync)) {
            return browser.storage.sync;
        }

        return browser.storage.local;
    }
}

let __storageProvieder: ICustomBrowserStorageProvider;

function createStorageProvider() {
    // chrome based browser
    // TODO: chrome.app?
    // if (assigned(chrome?.app)) {        
    if (true) {
        __storageProvieder = new StorageProviderChromium();
    }
    // firefox
    else {
        __storageProvieder = new StorageProviderFirefox();
    }

}

export function getGlobalStorageProvider(): ICustomBrowserStorageProvider {
    if (!assigned(__storageProvieder)) {
        createStorageProvider();
    }

    return __storageProvieder;
}