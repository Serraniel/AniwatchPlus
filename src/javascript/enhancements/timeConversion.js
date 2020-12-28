import spacetime from 'spacetime';
import { getGlobalConfiguration, SETTINGS_websiteAutoTimeConversion } from '../configuration/configuration';
import * as core from '../utils/aniwatchCore';
import * as helper from '../utils/helpers';

export function init() {
    getGlobalConfiguration().getProperty(SETTINGS_websiteAutoTimeConversion, value => {
        if (value) {
            core.runAfterLoad(() => {
                updateTimestamps();
            }, ".*");

            core.runAfterLocationChange(() => {
                updateTimestamps();
            }, ".*");
        }
    });
}

function getSpaceTimeFormat(use24Format) {
    if (use24Format) {
        return '{date}. {month-short} {year} {time-24}';
    }

    return '{date}. {month-short} {year} {time}';
}

function updateTimestamps() {
    let nodes = helper.findTextNodes();

    nodes.forEach(node => {
        const REG_DATETIME = /(\d{2}(\/|\.)){2}\d{4} *\d?\d:\d{2}( (AM|PM))?/g;
        const REG_TIME = /\d?\d:\d{2}/;
        const REG_AMPM = /\s(am|pm)/i;

        let hits = Array.from(node.textContent.matchAll(REG_DATETIME), match => match[0]);

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

                console.log(timeStr)

                processedStr = processedStr.replace(REG_TIME, timeStr);
                use24Format = true;
            }

            // if time has a space before am/pm, this has to be removed for spacetime
            processedStr = processedStr.replace(REG_AMPM, '$1');

            console.log(processedStr);
            let datetime = spacetime(processedStr, 'UTC+1', { dmy: true });
            datetime = datetime.goto(spacetime().tz);
            let replaceText = datetime.format(getSpaceTimeFormat(use24Format));
            console.log(replaceText);

            console.log('-------')
            node.textContent = node.textContent.replace(hit, replaceText);
        })
    });
}