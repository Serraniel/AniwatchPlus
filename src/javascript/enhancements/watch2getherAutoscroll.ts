import { getGlobalConfiguration, SETTINGS_w2gAutoscrollToUnseen } from '../configuration/configuration';
import * as core from '../utils/aniwatchCore';
import { assigned } from '../utils/helpers';

export function init(): void {
    getGlobalConfiguration().getProperty(SETTINGS_w2gAutoscrollToUnseen, value => {
        if (value) {
            core.runAfterLocationChange(() => {
                let element = findSearchResults();
                if (assigned(element)) {
                    observeSearchResults(element);
                }
            }, "^/watch2gether/.*$");
        }
    });
}

function observeSearchResults(searchRes: Element): void {
    let observer = new MutationObserver(mutations => {
        let scrollTarget = searchRes.querySelector('.ep-view md-list-item:not(.animelist-completed)') as HTMLElement;
        if (assigned(scrollTarget)) {
            // scroll container to episode first
            searchRes.scrollTop = scrollTarget.offsetTop;

            // then scroll page to episode if neccessarry
            scrollTarget.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    });

    observer.observe(searchRes, {
        childList: true,
        subtree: true,
    });
}

function findSearchResults(): Element {
    let searchResults = document.getElementsByClassName('search-results');
    if (searchResults[0] instanceof Element) {
        return searchResults[0];
    }
    return undefined;
}
