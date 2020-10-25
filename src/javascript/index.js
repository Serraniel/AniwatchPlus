// core
import { initCore } from './utils/aniwatchCore';
// helper
import { initHelpers } from './utils/helpers';
// enhancements
import { init as animeRequests } from './enhancements/animeRequests';
import { init as languageDisplay } from './enhancements/languageDisplay';
import { init as quickSearch } from './enhancements/quickSearch';
import { init as watch2getherChat } from './enhancements/watch2getherChat';

// core
initCore();

//helper
initHelpers();

// enhancements
animeRequests();
languageDisplay();
quickSearch();
watch2getherChat();