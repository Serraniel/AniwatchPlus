import { getGlobalStorageProvider } from "./settings/storageProvider";
import { onReady } from "./utils/helpers";

const OPTION_SELECTOR = '.extension-option'

function storeOptions() {
    document.querySelectorAll(OPTION_SELECTOR).forEach(optionElement => {
        getGlobalStorageProvider().setData(optionElement.id, optionElement.check);
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

onReady(() => {
    // register Store Button
    document.getElementById('saveBtn').addEventListener('click', storeOptions);

    // try restore options
    restoreOptions();
});