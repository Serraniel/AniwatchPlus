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

    }
}

let __globalConfig = undefined;

export function getGlobalConfiguration() {
    if (!assigned(__globalConfig)) {
        __globalConfig = new Configuration();
    }

    return __globalConfig;
}