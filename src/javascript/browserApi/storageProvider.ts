import { assigned } from '../utils/helpers';

enum BrowserApi {
    Unknown,
    Chromium,
    Firefox,
}

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

function getBrowserApi(): BrowserApi {
    if (typeof chrome !== 'undefined') {
        if (typeof browser !== 'undefined') {
            return BrowserApi.Firefox;
        }

        return BrowserApi.Chromium;
    }
    else if (typeof browser !== 'undefined') {
        return BrowserApi.Firefox;
    }

    return BrowserApi.Unknown;
}

function createStorageProvider() {

    let api = getBrowserApi();

    // chromium
    if (api === BrowserApi.Chromium) {
        __storageProvieder = new StorageProviderChromium();
    }
    // firefox
    else if (api === BrowserApi.Firefox) {
        __storageProvieder = new StorageProviderFirefox();
    }
    else {
        throw "Unknown browser API. Cannot create storage provider.";
    }
}

export function getGlobalStorageProvider(): ICustomBrowserStorageProvider {
    if (!assigned(__storageProvieder)) {
        createStorageProvider();
    }

    return __storageProvieder;
}