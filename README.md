# Aniwatch Plus
*Aniwatch Plus* is an unofficial extension which provides several UI improvments for https://aniwatch.me. 

## Features
* adds quick search to website
* cleaner style for lists
* better presentation of anime requests

## Browser Support
We currently support the following browsers in current versions:
* Google Chrome
* Mozilla Firefox
* Opera
* Microsoft Edge

### Installation
This extension isn´t available in browser stores yet. Please download from [releases](https://github.com/Serraniel/AniwatchPlus/releases) for your browser and check how to manually install an extension into your browser. If you want to install the extension in Microsoft Edge, please use the Chrome release version.

## Development
### Tools
This project requires you to install the latestst versions of [Node.js](https://nodejs.org/en/download/), [NPM](https://nodejs.org/en/download/) and [gulp](https://www.npmjs.com/package/gulp).
Minimum required versions:
| Tool | Version |
|-|-|
| Node.js | => 12.18.x |
| npm | => 6.14.x |
| gulp | => 4.0.x |
| gulp-cli\* | => 2.3.x |

\* only required if you plan to run gulp directly from command line.

### Build
```sh
# mandatory
npm install -d

# build release version into './dist'
npm run dist:prod

# build dev version into './div' and start the watcher
npm run watch

# clean build and dist directories
npm run clean
```