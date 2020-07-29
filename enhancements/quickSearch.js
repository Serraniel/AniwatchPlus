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
}

function handleQuickSearch(event) {
    if (event.key === 'Enter') {
        let url = new URL(window.location.origin)
        url.pathname = '/search';
        url.searchParams.append('q', document.getElementById(quickSearchID).value);

        let linkElement = document.getElementById(quickSearchLink);
        linkElement.href = `${url.pathname}${url.search}`;
        linkElement.click();
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