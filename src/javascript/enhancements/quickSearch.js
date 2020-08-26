const quickSearchID = 'ea-quickSearch';
const quickSearchLink = 'ea-quickSearchLink';

runAfterLoad(() => {
    initSearch();
}, ".*");

function initSearch() {
    let entry = document.createElement('li');
    entry.setAttribute('ng-repeat', 'item in navbar');
    entry.setAttribute('ng-class', '{\'anime-indicator\': item[\'@attributes\'].title==\'Anime\'}');

    let quickSearchElement = document.createElement('input');
    quickSearchElement.setAttribute('aria-label', 'Quick Search Input');
    quickSearchElement.setAttribute('ng-model-options', '{debounce: 500}');
    quickSearchElement.type = 'text';
    quickSearchElement.classList.add('ng-pristine', 'ng-valid', 'ng-empty', 'ng-touched');
    quickSearchElement.placeholder = 'Quick Search (Shift + F)';
    quickSearchElement.id = quickSearchID;
    // register Enter keybinding
    quickSearchElement.addEventListener('keypress', event => handleQuickSearch(event));

    entry.appendChild(quickSearchElement);

    // Aniwatch CSS requires the search input to be in some kind of known menu container
    let linkElement = document.createElement('a');
    linkElement.appendChild(quickSearchElement);
    linkElement.id = quickSearchLink;
    entry.appendChild(linkElement);

    let menu = document.getElementById('materialize-menu-dropdown');
    menu.insertAdjacentElement('beforeend', entry);

    // register focus hotkey
    document.addEventListener('keypress', event => handleSearchForShiftF(event));

    // additionally, the last dropdown ul has a "right: 0px" style, which has to be fixed with auto, otherwhise it will pop up in the wrong position
    Array.from(menu.querySelectorAll('ul.dropdown')).slice(-1)[0].style.right = 'auto';
}

function handleQuickSearch(event) {
    if (event.key === 'Enter') {
        let quickSearchElement = document.getElementById(quickSearchID);
        let linkElement = document.getElementById(quickSearchLink);

        let url = new URL(window.location.origin)
        url.pathname = '/search';
        url.searchParams.append('q', quickSearchElement.value);

        // clicking the link; we are not setting window.location because this will trigger a complete reload of the site
        linkElement.href = `${url.pathname}${url.search}`;
        linkElement.click();

        // clean up afterwards
        linkElement.href = '';
        quickSearchElement.value = '';
    }
}

function handleSearchForShiftF(event) {
    if (isShiftPressed) {
        if (event.key === 'F') {
            event.preventDefault();
            document.getElementById(quickSearchID).focus();
        }
    }
}