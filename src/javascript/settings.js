import { getGlobalStorageProvider } from "./browserApi/storageProvider";
import { onReady } from "./utils/helpers";

const OPTION_SELECTOR = 'input[type="checkbox"';

function storeOptions() {
    document.querySelectorAll(OPTION_SELECTOR).forEach(optionElement => {
        getGlobalStorageProvider().setData(optionElement.id, optionElement.checked);
    });
}

function restoreOptions() {
    document.querySelectorAll(OPTION_SELECTOR).forEach(optionElement => {
        let defaultValue = optionElement.dataset.defaultValue === 'true' ? true : false;

        getGlobalStorageProvider().getData(optionElement.id, defaultValue, value => {
            optionElement.checked = value;
        });
    });
}

function resetOptions() {
    document.querySelectorAll(OPTION_SELECTOR).forEach(optionElement => {
        let defaultValue = optionElement.dataset.defaultValue === 'true' ? true : false;

        optionElement.checked = defaultValue;
    });
}

onReady(() => {
    // register Store Button
    document.getElementById('btnSave').addEventListener('click', event => {
        event.preventDefault();
        storeOptions();
    });

    document.getElementById('btnReset').addEventListener('click', event => {
        event.preventDefault();
        resetOptions();
        storeOptions();
    })

    // try restore options
    restoreOptions();

    // update version label
    document.getElementById('version').innerText = `v${chrome.runtime.getManifest().version}`
});