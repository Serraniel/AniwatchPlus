registerScript(node => {
    // run the scripts
    if (isHtmlElement(node)) {
        changeFollowedStarColor(node);
        changeOwnBorderColor(node);
        removeUnknownUsers(node);
    }
});

function changeFollowedStarColor(node) {
    const starIcon = 'star';

    // find stars
    let followedItems = Array.from(node.querySelectorAll('i')).filter(i => i.innerText.trim() === starIcon);

    // change color
    followedItems.forEach(item => item.style.color = aniBlue);
}

function changeOwnBorderColor(node) {
    const targetTagName = 'MD-LIST-ITEM'; // tagName is upper case

    let updateFunc = item => {
        let profileLink = item.querySelectorAll('a[href*="/profile/"]:not([href="/profile/false"])');

        if (profileLink.length > 0) {
            item.style.borderColor = aniBlue
        }
    }

    // are we target tag?
    if (node.tagName === targetTagName) {
        updateFunc(node);
    } else {
        // find items -> all 
        let requestItems = node.querySelectorAll('md-list-item');

        // change border color if profile link is not 'false'
        requestItems.forEach(item => {
            updateFunc(item);
        });
    }
}

function removeUnknownUsers(node) {
    const targetTagName = 'MD-LIST-ITEM'; // tagName is upper case

    let updateFunc = item => {
        // find user profile link -> own request
        let profileLink = item.querySelectorAll('a[href*="/profile/"]:not([href="/profile/false"])');

        // find divs
        let upperDiv = node.querySelector('[layout-align="start center"][flex]')
        let lowerDiv = upperDiv.parentElement.nextElementSibling;

        // remember Data
        let anime = lowerDiv.innerText;
        let profileData = upperDiv.innerHTML;

        // exchange data
        upperDiv.innerHTML = `<b>${anime}</b>`;

        // add user note if own request
        if (profileLink.length > 0) {
            lowerDiv.innerHTML = profileData;
        }
        // remove if foreign request.
        else {
            lowerDiv.innerHTML = '&nbsp;';
        }
    }

    if (node.tagName === targetTagName) {
        updateFunc(node);
    } else {
        // find items -> all 
        let requestItems = node.querySelectorAll('md-list-item');

        // change border color if profile link is not 'false'
        requestItems.forEach(item => {
            updateFunc(item);
        });
    }
}