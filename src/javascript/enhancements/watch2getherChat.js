import * as core from '../utils/aniwatchCore';
import * as helper from '../utils/helpers';

export function init() {
    core.runAfterLoad(() => {
        manipulateChatInput();    
    }, "^/watch2gether/.*$");
}

function manipulateChatInput(){
 
}