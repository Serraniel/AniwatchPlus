// Saves settings to chrome.storage
function save_settings() {
    let items = {
        maxPlayerWidth: document.getElementById('maxPlayerWidth').value,
        actualPlayerWidth: document.getElementById('actualPlayerWidth').value
    };

    chrome.storage.local.set(items, function() {
        alert('Settings saved.');
    });
}

// Restores the settings from chrome.storage
function restore_settings() {
    chrome.storage.local.get([
    'maxPlayerWidth',
    'actualPlayerWidth'
    ], function(r) {
        document.getElementById('maxPlayerWidth').value = r.maxPlayerWidth;
        document.getElementById('actualPlayerWidth').value = r.actualPlayerWidth;
    });
}

document.getElementById('save').addEventListener('click', save_settings);
document.addEventListener('DOMContentLoaded', restore_settings);
