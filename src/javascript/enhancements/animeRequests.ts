import { getGlobalConfiguration, SETTINGS_requestBeautifyPage } from '../configuration/configuration';
import * as core from '../utils/aniwatchCore';
import * as color from '../utils/colors';

export function init(): void {
    getGlobalConfiguration().getProperty(SETTINGS_requestBeautifyPage, value => {
        if (value) {
            core.registerScript(node => {
                // run the scripts
                if (node instanceof HTMLElement) {
                    changeFollowedStarColor(node);
                    changeBorderColorOwnRequests(node);
                    removeUnknownUsers(node);
                }
            }, "/requests");
        }
    });
}

function changeFollowedStarColor(node: HTMLElement): void {
    const STAR_ICON = 'star';

    // find stars
    let followedItems = Array.from(node.querySelectorAll('i')).filter(i => i.innerText.trim() === STAR_ICON);

    // change color
    followedItems.forEach(item => item.style.color = color.aniBlue);
}

function changeBorderColorOwnRequests(node: HTMLElement): void {
    const TARGET_TAG_NAME = 'MD-LIST-ITEM'; // tagName is upper case

    let updateFunc = (item: HTMLElement): void => {
        let profileLink = item.querySelectorAll('a[href*="/profile/"]:not([href="/profile/false"])');

        // highlight left border for own request
        if (profileLink.length > 0) {
            item.style.borderLeftColor = color.aniBlue
        }
    }

    // are we target tag?
    if (node.tagName === TARGET_TAG_NAME) {
        updateFunc(node);
    } else {
        // find items -> all 
        let requestItems = node.querySelectorAll('md-list-item');

        // update borders
        requestItems.forEach(item => {
            if (item instanceof HTMLElement) {
                updateFunc(item);
            }
        });
    }
}

function removeUnknownUsers(node: HTMLElement): void {
    const TARGET_TAG_NAME = 'MD-LIST-ITEM'; // tagName is upper case

    let updateFunc = (item: Element) => {
        // find user profile link -> own request
        let profileLink = item.querySelectorAll('a[href*="/profile/"]:not([href="/profile/false"])');

        // find divs
        let upperDiv = node.querySelector('[layout-align="start center"][flex]')
        let lowerDiv = upperDiv.parentElement.nextElementSibling;

        // remember Data
        let anime = lowerDiv.textContent;
        let profileData = upperDiv.innerHTML;

        // add user note if own request
        if (profileLink.length > 0) {
            // Workaround to avoid innerHTML because of #38, see https://devtidbits.com/2017/12/06/quick-fix-the-unsafe_var_assignment-warning-in-javascript/
            let parser = new DOMParser();
            let parsedDocument = parser.parseFromString(profileData, 'text/html');

            lowerDiv.innerHTML = '';
            while (parsedDocument.body.hasChildNodes()) {
                lowerDiv.appendChild(parsedDocument.body.removeChild(parsedDocument.body.firstChild));
            }
        }
        // remove if foreign request.
        else {
            lowerDiv.innerHTML = '&nbsp;';
        }

        // exchange data
        let bElement = document.createElement('b');
        bElement.textContent = anime;
        upperDiv.innerHTML = ``;
        upperDiv.appendChild(bElement);
    }

    if (node.tagName === TARGET_TAG_NAME) {
        updateFunc(node);
    } else {
        // find items -> all 
        let requestItems = node.querySelectorAll('md-list-item');

        // change border color if profile link is not 'false'
        requestItems.forEach(item => {
            updateFunc(item);
        });
    }
}