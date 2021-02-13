// core
import { initCore } from './utils/aniwatchCore';
// helper
import { initHelpers } from './utils/helpers';
// enhancements
import { init as anilyr } from './enhancements/anilyr';
import { init as animeRequests } from './enhancements/animeRequests';
import { init as fontColor } from './enhancements/fontColor';
import { init as languageDisplay } from './enhancements/languageDisplay';
import { init as notifications } from './enhancements/notifications';
import { init as quickSearch } from './enhancements/quickSearch';
import { init as timeConversion } from './enhancements/timeConversion';
import { init as watch2getherChat } from './enhancements/watch2gether';
import { init as watch2getherAutotoggleHide } from './enhancements/watch2getherHide';
// css
import { init as cssEnhancements } from './enhancements/cssEnhancements';

// core
initCore();

//helper
initHelpers();

// enhancements
anilyr();
animeRequests();
fontColor();
languageDisplay();
notifications();
quickSearch();
timeConversion();
watch2getherChat();
watch2getherAutotoggleHide();

// css
cssEnhancements();