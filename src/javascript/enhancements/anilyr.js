import * as core from '../utils/aniwatchCore';
import * as helper from '../utils/helpers';

export function init() {
    core.registerScript(node => {
        // run the scripts
       
    }, "^/anime/[0-9]*/[0-9]*$");
}

