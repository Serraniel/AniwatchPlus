import spacetime from 'spacetime';
import { getGlobalConfiguration, SETTINGS_websiteAutoTimeConversion } from '../configuration/configuration';
import * as core from '../utils/aniwatchCore';
import * as helper from '../utils/helpers';

const __alteredNodes = [];

export function init() {
    getGlobalConfiguration().getProperty(SETTINGS_websiteAutoTimeConversion, value => {
        if (value) {
            core.runAfterLoad(() => {
                updateTimestamps(document.documentElement);
            }, ".*");

            core.runAfterLocationChange(() => {
                updateTimestamps(document.documentElement);
            }, ".*");

            core.registerScript(node => {
                updateTimestamps(node);
            }, ".*");
        }
    });
}

function getSpaceDateTimeFormat(use24Format) {
    return `${getSpaceDateFormat()} ${getSpaceTimeFormat(use24Format)}`;
}

function getSpaceTimeFormat(use24Format) {
    if (use24Format) {
        return '{time-24}';
    }

    return '{time}';
}

function getSpaceDateFormat() {
    return '{date}. {month-short} {year}';
}

function tryUpdateDateTime(node) {
    const REG_DATETIME = /(\d{2}(\/|\.)){2}\d{4} *\d?\d:\d{2}( (AM|PM))?/g;
    const REG_TIME = /\d?\d:\d{2}/;
    const REG_AMPM = /\s(am|pm)/i;

    let hits = Array.from(node.textContent.matchAll(REG_DATETIME), match => match[0]);

    if (hits.length === 0) {
        return false;
    }

    hits.forEach(hit => {
        let use24Format = false;
        let processedStr = hit

        // string must be converted into 12h format
        if (processedStr.search(REG_AMPM) < 0) {
            let timeStr = processedStr.match(REG_TIME)[0];
            let hm = timeStr.split(':');
            let hour = parseInt(hm[0]);

            if (hour >= 12) {
                timeStr = timeStr.replace(`${hour}:`, `${hour - 12}:`);
                timeStr += 'pm';
            }
            else {
                timeStr += 'am';
            }

            processedStr = processedStr.replace(REG_TIME, timeStr);
            use24Format = true;
        }

        // if time has a space before am/pm, this has to be removed for spacetime
        processedStr = processedStr.replace(REG_AMPM, '$1');

        let datetime = spacetime(processedStr, 'UTC+1', { dmy: true });
        datetime = datetime.goto(spacetime().tz);
        let replaceText = datetime.format(getSpaceDateTimeFormat(use24Format));

        node.textContent = node.textContent.replace(hit, replaceText);
    });

    return true;
}

function tryUpdateDate(node) {
    const REG_DATE = /(\d{2}(\/|\.)){2}\d{4}/g;

    let hits = Array.from(node.textContent.matchAll(REG_DATE), match => match[0]);

    if (hits.length === 0) {
        return false;
    }

    hits.forEach(hit => {
        let datetime = spacetime(hit, 'UTC+1', { dmy: true });
        datetime = datetime.goto(spacetime().tz);
        let replaceText = datetime.format(getSpaceDateFormat());

        node.textContent = node.textContent.replace(hit, replaceText);
    });

    return true;
}

function tryUpdateTime(node) {
    const REG_TIME = /\d?\d:\d{2}( (AM|PM))?/g;
    const REG_AMPM = /\s(am|pm)/i;

    let hits = Array.from(node.textContent.matchAll(REG_TIME), match => match[0]);

    if (hits.length === 0) {
        return false;
    }

    hits.forEach(hit => {
        let use24Format = false;
        let processedStr = hit

        // string must be converted into 12h format
        if (processedStr.search(REG_AMPM) < 0) {
            let timeStr = processedStr.match(REG_TIME)[0];
            let hm = timeStr.split(':');
            let hour = parseInt(hm[0]);

            if (hour >= 12) {
                timeStr = timeStr.replace(`${hour}:`, `${hour - 12}:`);
                timeStr += 'pm';
            }
            else {
                timeStr += 'am';
            }

            processedStr = processedStr.replace(REG_TIME, timeStr);
            use24Format = true;
        }

        // if time has a space before am/pm, this has to be removed for spacetime
        processedStr = processedStr.replace(REG_AMPM, '$1');

        let datetime = spacetime();
        datetime = datetime.goto('UTC+1');
        datetime = datetime.time(processedStr);
        datetime = datetime.goto(spacetime().tz);
        let replaceText = datetime.format(getSpaceTimeFormat(use24Format));

        node.textContent = node.textContent.replace(hit, replaceText);
    });

    return true;
}

function tryUpdateTimeZone(node) {
    const HINT_UTC = 'UTC+1';
    if (node.textContent === HINT_UTC) {
        let tzMeta = spacetime().timezone();

        node.textContent = `${tzMeta.name} (UTC${tzMeta.current.offset >= 0 ? '+' : ''}${tzMeta.current.offset})`;
    }
}

function updateTimestamps(node) {
    let nodes = helper.findTextNodes(node);

    nodes.forEach(node => {
        // avoid double updates
        if (__alteredNodes.indexOf(node) >= 0) {
            return;
        }

        if (tryUpdateDateTime(node)) {
            __alteredNodes.push(node);
            return;
        }

        if (tryUpdateDate(node)) {
            __alteredNodes.push(node);
            return;
        }

        if (tryUpdateTime(node)) {
            __alteredNodes.push(node);
            return;
        }

        if (tryUpdateTimeZone(node)) {
            __alteredNodes.push(node);
            return;
        }
    });
}