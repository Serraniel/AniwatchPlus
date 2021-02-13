import { getGlobalConfiguration, SETTINGS_w2gAutoscrollToUnseen } from '../configuration/configuration';
import * as core from '../utils/aniwatchCore';
import { assigned } from '../utils/helpers';

export function init(): void {
    getGlobalConfiguration().getProperty(SETTINGS_w2gAutoscrollToUnseen, value => {
        if (value) {
            core.runAfterLocationChange(() => {
                let element = findSearchResults();
                console.log(element);
                if (assigned(element)) {
                    observeSearchResults(element);
                }
            }, "^/watch2gether/.*$");
        }
    });
}

function observeSearchResults(searchRes: Element): void {
    let observer = new MutationObserver(mutations => {
        let scrollTarget = searchRes.querySelector('md-list-item:not(.animelist-completed):not(.animelist-completed-add)') as HTMLElement;

        if (assigned(scrollTarget)) {
            // The node isn´t in its correct position directly when it´s added so we wait a small bit of time before we start scrolling.
            // Also works for long loading lists which need more time to load than we wait (for example One Piece).
            window.setTimeout(() => {
                // scroll container to episode first
                searchRes.scrollTop = scrollTarget.offsetTop;

                // then scroll page to episode if neccessarry
                scrollTarget.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }, 500);
        }
    });

    observer.observe(searchRes, {
        childList: true,
    });
}

function findSearchResults(): Element {
    return document.querySelector('.search-results .ep-view');
}
