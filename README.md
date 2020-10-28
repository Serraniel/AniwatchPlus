<img align="right" width="100" height="100" src="resources/logo/AnimeWatch.ico/main/black/AWPLUS%20Final%20Black%20128.png">

[![Travis (.org)](https://img.shields.io/travis/serraniel/aniwatchplus?style=flat-square)](https://travis-ci.org/github/Serraniel/AniwatchPlus)
[![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/serraniel/aniwatchplus?style=flat-square)](https://snyk.io/test/github/Serraniel/AniwatchPlus?targetFile=package.json)
[![David](https://img.shields.io/david/serraniel/AniwatchPlus?style=flat-square)](https://david-dm.org/serraniel/aniwatchplus)
[![Scrutinizer code quality (GitHub/Bitbucket)](https://img.shields.io/scrutinizer/quality/g/serraniel/aniwatchplus?style=flat-square)](https://scrutinizer-ci.com/g/Serraniel/AniwatchPlus/)
[![GitHub issues](https://img.shields.io/github/issues/serraniel/aniwatchplus?style=flat-square)](https://github.com/Serraniel/AniwatchPlus/issues)
[![GitHub](https://img.shields.io/github/license/serraniel/aniwatchplus?style=flat-square)](https://github.com/Serraniel/AniwatchPlus/blob/develop/LICENSE)

# Aniwatch Plus
**Aniwatch Plus** is an unofficial browser extension which will improve your experience on https://aniwatch.me by adding features like a quick search and improving the websites appearance.

## Features
* Adds quick search
* Cleaner list presentation
* Improved presentation of available audio and subtitles
* Better display of anime requests 

## Download
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/hgniihpjiioldkafogebpkbaiflmpimb?label=Google%20Chrome&logo=Google%20Chrome&style=flat-square)](https://chrome.google.com/webstore/detail/aniwatch-plus/hgniihpjiioldkafogebpkbaiflmpimb?hl=de)
[![Mozilla Add-on](https://img.shields.io/amo/v/aniwatch-plus?label=Mozilla%20Firefox&logo=Firefox&style=flat-square)](https://addons.mozilla.org/de/firefox/addon/aniwatch-plus/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search)
[![GitHub release tag for opera (latest by date including pre-releases)](https://img.shields.io/github/v/release/serraniel/aniwatchplus?include_prereleases&label=Opera&logo=Opera&logoColor=red&style=flat-square)](https://addons.opera.com/de/extensions/details/aniwatch-plus/)
[![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/serraniel/aniwatchplus?include_prereleases&label=Download%20manually&logo=Github&style=flat-square)](https://github.com/Serraniel/AniwatchPlus/releases)

## Development
### Tools
This project requires you to install the latestst versions of [Node.js](https://nodejs.org/en/download/), [NPM](https://nodejs.org/en/download/) and [gulp](https://www.npmjs.com/package/gulp).
Minimum required versions:
| Tool | Version |
|-|-|
| node.js | ^14.x.x |
| npm | ^6.x.x |
| gulp | ^4.x.x |


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
