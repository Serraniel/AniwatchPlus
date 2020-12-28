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

function updateTimestamps() {
    let nodes = helper.findTextNodes();

    nodes.forEach(node => {
        const REG_DATETIME = /(\d{2}(\/|\.)){2}\d{4} *\d?\d:\d{2}( (AM|PM))?/g;
        let hits = Array.from(node.textContent.matchAll(REG_DATETIME), match => match[0]);

        hits.forEach(hit => {
            // if time has a space before am/pm, this has to be removed for spacetime
            let processedStr = hit.replace(/\s(am|pm)/i, '$1');

            console.log(processedStr);
            let datetime = spacetime(processedStr, 'UTC+1', { dmy: true });
            datetime = datetime.goto(spacetime().tz);
            let replaceText = datetime.format('{date}. {month-short} {year} {time}');
            console.log(replaceText);

            console.log('-------')
            // node.textContent = node.textContent.replace(hit, replaceText);
        })
    });
}