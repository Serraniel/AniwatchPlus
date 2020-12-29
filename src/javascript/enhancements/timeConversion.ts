import spacetime from 'spacetime';
import { getGlobalConfiguration, SETTINGS_websiteAutoTimeConversion } from '../configuration/configuration';
import * as core from '../utils/aniwatchCore';
import * as helper from '../utils/helpers';

const __alteredNodes = [];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function init() {
    getGlobalConfiguration().getProperty(SETTINGS_websiteAutoTimeConversion, value => {
        if (value) {
            // The regexp pattern matches anything except the airing page. 
            // This is because we would have to restructure the complete site to update time data.
            // Additionally, there is a big hint that all data would be UTC+1
            core.runAfterLoad(() => {
                updateTimestamps(document.documentElement);
            }, "^/(?!airing).*$");

            core.runAfterLocationChange(() => {
                updateTimestamps(document.documentElement);
            }, "^/(?!airing).*$");

            core.registerScript(node => {
                updateTimestamps(node);
            }, "^/(?!airing).*$");
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

        // SPECIAL CASE: Anime has the day written in broadcast bade. This may be different in another timezone
        let tzMeta = spacetime().timezone();
        let originalH = datetime.hour() - tzMeta.current.offset + 1;

        let dOffset = 0;
        // we moved to next day
        if (originalH < 0) {
            dOffset = 1;
        }
        // we moved to previous day
        else if (originalH > 24) {
            dOffset = -1;
        }

        // if day changed
        if (dOffset != 0) {
            let dayNode = node.parentNode.previousElementSibling;
            if (helper.assigned(dayNode)) {
                for (let i = 0; i < DAYS.length; i++) {
                    if (dayNode.textContent.indexOf(DAYS[i]) >= 0) {
                        dayNode.textContent = dayNode.textContent.replace(DAYS[i], DAYS[(i + DAYS.length + dOffset) % DAYS.length]); // add DAYS.length to avoid negative numbers in the modulo operation
                        break;
                    }
                }
            }
        }
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