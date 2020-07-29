registerScript(node => {
    // run the scripts
    if (isHtmlElement(node)) {
        changeFollowedStarColor(node);
        changeOwnBorderColor(node);
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