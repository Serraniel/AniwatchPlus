// core
import { initCore } from './utils/aniwatchCore';
// helper
import { initHelpers } from './utils/helpers';
// enhancements
import { init as anilyr } from './enhancements/anilyr';
import { init as animeRequests } from './enhancements/animeRequests';
import { init as languageDisplay } from './enhancements/languageDisplay';
import { init as notifications } from './enhancements/notifications';
import { init as quickSearch } from './enhancements/quickSearch';
import { init as watch2getherChat } from './enhancements/watch2getherChat';

// core
initCore();

//helper
initHelpers();

// enhancements
anilyr();
animeRequests();
languageDisplay();
notifications();quickSearch();
watch2getherChat();