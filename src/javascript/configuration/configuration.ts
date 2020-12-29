import { ConfigurationStorageBooleanCallback, getGlobalStorageProvider } from "../browserApi/storageProvider";
import { assigned } from "../utils/helpers";

// website
export const SETTINGS_websiteDisplayQuickSearch = 'websiteDisplayQuickSearch';
export const SETTINGS_websiteAutoTimeConversion = 'websiteAutoTimeConversion';
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
    settingsCache: Map<string, boolean>;

    constructor() {
        this.settingsCache = new Map();
    }

    getProperty(key: string, callback: ConfigurationStorageBooleanCallback): void {
        if (this.settingsCache.has(key)) {
            callback(this.settingsCache.get(key));
        }
        else {
            // TODO see comment
            // OOOPS // currently all settings are default true. This isn´t a problem but there should be much better soloutions after migration to typescript....
            getGlobalStorageProvider().getDataAsBoolean(key, true, value => {
                this.settingsCache.set(key, value);
                callback(value);
            });
        }
    }
}

let __globalConfig: Configuration;

export function getGlobalConfiguration() {
    if (!assigned(__globalConfig)) {
        __globalConfig = new Configuration();
    }

    return __globalConfig;
}
