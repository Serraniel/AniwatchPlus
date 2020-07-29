runAfterLoad(() => {
    initSearch();
}, ".*");

function initSearch() {
    let menu = document.getElementById('materialize-menu-dropdown');

    let entry = document.createElement('li');
    entry.setAttribute('ng-repeat', 'item in navbar');
    entry.setAttribute('ng-class', '{\'anime-indicator\': item[\'@attributes\'].title==\'Anime\'}');

    let quickSearchElement = document.createElement('input');
    quickSearchElement.setAttribute('aria-label', 'Quick Search Input');
    quickSearchElement.setAttribute('ng-model-options', '{debounce: 500}');
    quickSearchElement.type = 'text';
    quickSearchElement.classList.add('ng-pristine', 'ng-valid', 'ng-empty', 'ng-touched');
    quickSearchElement.placeholder = 'Quick Search (Shift + F)';
    quickSearchElement.addEventListener('keydown', event => handleQuickSearch(event, quickSearchElement));

    entry.appendChild(quickSearchElement);

    menu.insertAdjacentElement('beforeend', entry);
}

function handleQuickSearch(event, quickSearchElement) {
    if (event.key === 'Enter') {
        let url = new URL(window.location.origin)
        url.pathname = '/search';
        url.searchParams.append('q', quickSearchElement.value);

        window.location.href = url.href;
    }
}