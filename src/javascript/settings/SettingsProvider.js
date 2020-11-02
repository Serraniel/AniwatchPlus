// Currently only supports local storage

let data = {
    'usedBytes': {}
};

// Get all the keys + values from the storage
function getStorageData(keys) {
    chrome.storage.local.get(keys, function(values) {
        Object.assign(data, values);
    });
}

// Save all the keys + values to the storage
function setStorageData(items) {
    chrome.storage.local.set(items);
}

// Get Data from data{}
// or just use data[key] or data.key to grab it
function getStorageEntry(entry) {
    if (typeof entry === 'string') {
        if (data.hasOwnProperty(entry)) {
            console.log(entry);
            console.log(data[entry]);
            return data[entry];
        }
        else {
            console.log("Initialize Data first.");
        }
    }
}

// Get bytes used by local storage
// Accepts nothing, an object or a string
function getStorageBytesInUse(keys) {
    // Get all used bytes
    if (typeof keys === 'undefined' || (typeof keys === 'objects' && Object.keys(keys).length === 0)){
        console.log("No keys given, grabbing total bytes used.");
        chrome.storage.local.getBytesInUse(null, function(value) {
            if (chrome.runtime.lastError) {
                console.log("Error retrieving entry: " + chrome.runtime.lastError);
                return;
            }
            else {
                console.log(`Used storage bytes: ${value}`);
                data.usedBytes.total = value;
            }
        });
    }
    // Get bytes for the provided object
    else if (typeof keys === 'object') {
        if (Object.keys(keys).length === 1) {
            console.log(keys);
            console.log(`Key given, grabbing total bytes used by ${keys}.`);
            chrome.storage.local.getBytesInUse(keys, function(value) {
                if (chrome.runtime.lastError) {
                    console.log("Error retrieving entry: " + chrome.runtime.lastError);
                    return;
                }
                console.log(`Used storage bytes by ${keys}: ${value}`);
                data.usedBytes[keys] = value;
            });
        }
        else if (Object.keys(keys).length > 1) {
            console.log(keys);
            console.log(`Multiple keys given, grabbing total bytes used by ${keys}.`);
            for (var key in keys) {
                let temp = keys[key];
                console.log(temp);
                chrome.storage.local.getBytesInUse(temp, function(value) {
                    if (chrome.runtime.lastError) {
                        console.log("Error retrieving entry: " + chrome.runtime.lastError);
                        return;
                    }
                    else {
                        console.log(`Used storage bytes by ${temp}: ${value}`);
                        data.usedBytes[temp] = value;
                    }
                });
            }
        }
    }
    // Get bytes for the provided string
    else if (typeof keys === 'string') {
        console.log(keys);
        console.log(`Key given, grabbing total bytes used by ${keys}.`);
        chrome.storage.local.getBytesInUse(keys, function(values) {
            if (chrome.runtime.lastError) {
                console.log("Error retrieving entry: " + chrome.runtime.lastError);
                return;
            }
            else {
                console.log(`Used storage bytes by ${keys}: ${values}`);
                data.usedBytes[keys] = values;
            }
        });

    }
}

// Remove the provided Entry from local storage
function removeStorageEntry(keys) {
    // stop if undefined or empty object
    if (typeof keys === 'undefined' || (typeof keys === 'objects' && Object.keys(keys).length === 0)) {
        console.log("thats not how this works.");
        return;
    }
    // handle keys if object
    else if (typeof keys === 'object') {
        if (Object.keys(keys).length >= 1) {
            console.log(keys);
            for (var key in keys) {
                let temp = keys[key];
                chrome.storage.local.remove(temp, function() {
                    if (chrome.runtime.lastError) {
                        console.log("Error retrieving entry: " + chrome.runtime.lastError);
                        return;
                    }
                    else {
                        console.log("deleting");
                        delete data[temp];
                    }
                });
            }
            return;
        }
    }
    // handle keys as string
    else if (typeof keys === 'string') {
        console.log("reached");
        chrome.storage.local.remove(keys, function() {
            if (chrome.runtime.lastError) {
                console.log("Error retrieving entry: " + chrome.runtime.lastError);
                return;
            }
            else {
                delete data[keys];
            }
        });
    }
}

// Clear the storage completely
// also clears data
function clearStorageEntries() {
    chrome.storage.local.clear();
    data = {};
}

// missing onChanged Event
