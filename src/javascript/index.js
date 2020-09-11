import regeneratorRuntime from "regenerator-runtime";

// core
import { initCore } from './utils/aniwatchCore';
// helper
import { initHelpers } from './utils/helpers';
// enhancements
import { init as animeRequests } from './enhancements/animeRequests';
import { init as lists } from './enhancements/lists';
import { init as notifications } from './enhancements/notifications';
import { init as quickSearch } from './enhancements/quickSearch';

// core
initCore();

//helper
initHelpers();

// enhancements
animeRequests();
lists();
notifications();
quickSearch();