import { getGlobalStorageProvider } from "../browserApi/storageProvider";
import { assigned } from "../utils/helpers";

// website
export const SETTINGS_websiteDisplayQuickSearch = 'websiteDisplayQuickSearch';
export const SETTINGS_websiteShowNotificationsCountInTab = 'websiteShowNotificationsCountInTab';
export const SETTINGS_websiteHideUnusedTabs = 'websiteHideUnusedTabs';
export const SETTINGS_websiteOptimizeListAppearance = 'websiteOptimizeListAppearance';
export const SETTINGS_websiteOptimizeFontColors = 'websiteOptimizeFontColors';
// anime
export const SETTINGS_animeLanguageDisplay = 'animeLanguageDisplay';
// requests 
export const SETTINGS_requestBeautifyPage = 'requestBeautifyPage';
// player
export const SETTINGS_playerAutoplayAfterScreenshot = 'playerAutoplayAfterScreenshot';
// w2g
export const SETTINGS_w2gDisplayCharacterCounter = 'w2gDisplayCharacterCounter';
class Configuration {
    constructor() {
        this.settingsCache = new Map();
    }

    getProperty(key, callback) {
        if (this.settingsCache.has(key)) {
            callback(this.settingsCache.get(key));
        }
        else {
            // OOOPS // currently all settings are default true. This isn´t a problem but there should be much better soloutions after migration to typescript....
            getGlobalStorageProvider().getData(key, true, value => {
                this.settingsCache.set(key, value);
                callback(value);
            });
        }
    }
}

let __globalConfig;

export function getGlobalConfiguration() {
    if (!assigned(__globalConfig)) {
        __globalConfig = new Configuration();
    }

    return __globalConfig;
}