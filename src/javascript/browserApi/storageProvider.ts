const { assigned } = require("../utils/helpers")

export interface ICustomBrowserStorageProvider {
    setData(key: string, value: string): void;
    getData(key: string, defaultValue: string, callback: (x: string) => void): void;
}

class StorageProviderChromium implements ICustomBrowserStorageProvider {

    setData(key: string, value: string): void {
        let obj = {};
        obj[key] = value;

        this.getStorage().set(obj);
    }

    getData(key: string, defaultValue: string, callback: (x: string) => void): void {
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

    setData(key: string, value: string): void {
        let obj = {};
        obj[key] = value;

        this.getStorage().set(obj);
    }

    getData(key: string, defaultValue: string, callback: (x: string) => void): void {
        let promise = this.getStorage().get(key);

        promise.then(items => {
            if (assigned(items) && assigned(items[key])) {
                callback(items[key] as string);
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