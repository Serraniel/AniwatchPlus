import * as core from '../utils/aniwatchCore';
import * as helper from '../utils/helpers';

export function init() {
    core.registerScript(node => {
        // run the scripts
        if (helper.isHtmlElement(node)) {
            restructureImport(node)
        }
    }, "^/profile/[0-9]*\?tab=[0-9]*$");
}

function restructureImport(node){

}