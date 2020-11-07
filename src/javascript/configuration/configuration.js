import { getGlobalStorageProvider } from "../browserApi/storageProvider";
import { assigned } from "../utils/helpers";

class Configuration {
    constructor() {
        // website
        this.websiteDisplayQuickSearch = true;
        this.websiteShowNotificationsCountInTab = true;
        this.websiteHideUnusedTabs = true;
        this.websiteOptimizeListAppearance = true;

        // anime
        this.animeLanguageDisplay = true;

        // requests 
        this.requestBeautifyPage = true;

        // player 
        this.playerAutoplayAfterScreenshot = true;

        // w2g
        this.w2gDisplayCharacterCounter = true;

        this.reloadConfiguration();
    }

    reloadConfiguration() {
        // website
        getGlobalStorageProvider().getData('websiteDisplayQuickSearch', this.websiteDisplayQuickSearch, value => this.websiteDisplayQuickSearch = value);
        getGlobalStorageProvider().getData('websiteShowNotificationsCountInTab', this.websiteShowNotificationsCountInTab, value => this.websiteShowNotificationsCountInTab = value);
        getGlobalStorageProvider().getData('websiteHideUnusedTabs', this.websiteHideUnusedTabs, value => this.websiteHideUnusedTabs = value);
        getGlobalStorageProvider().getData('websiteOptimizeListAppearance', this.websiteOptimizeListAppearance, value => this.websiteOptimizeListAppearance = value);

        // anime
        getGlobalStorageProvider().getData('animeLanguageDisplay', this.animeLanguageDisplay, value => this.animeLanguageDisplay = value);

        // requests
        getGlobalStorageProvider().getData('requestBeautifyPage', this.requestBeautifyPage, value => this.requestBeautifyPage = value);

        // player
        getGlobalStorageProvider().getData('playerAutoplayAfterScreenshot', this.playerAutoplayAfterScreenshot, value => this.playerAutoplayAfterScreenshot = value);

        // w2g
        getGlobalStorageProvider().getData('w2gDisplayCharacterCounter', this.w2gDisplayCharacterCounter, value => this.w2gDisplayCharacterCounter = value);

        console.log(this);
    }
}

let __globalConfig = undefined;

export function getGlobalConfiguration() {
    if (!assigned(__globalConfig)) {
        __globalConfig = new Configuration();
    }

    return __globalConfig;
}