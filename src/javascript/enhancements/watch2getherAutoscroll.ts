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
        mutations.forEach(mutation => {
            let num = searchRes.getElementsByClassName('md-2-line border _md-button-wrap _md md-clickable animelist-completed').length;
            scrollTo(searchRes, num);
        });
    });

    observer.observe(searchRes, {
        childList: true,
        subtree: true,
    });
}

function scrollTo(el: Element, pos: number): void {
    let offset: number = 24;
    el.scrollTo(0, pos * 72 + offset)
}

function findSearchResults(): Element {
    let searchResults = document.getElementsByClassName('search-results');
    if (searchResults[0] instanceof Element) {
        return searchResults[0];
    }
    return undefined;
}
