const starIcon = "star";

executeAfterPreload(changeFollowedStarColor);
executeAfterPreload(changeOwnBorderColor);

function changeFollowedStarColor() {
    // find stars
    let followedItems = Array.from(document.querySelectorAll("i")).filter(i => i.innerText == starIcon);

    // change color
    followedItems.forEach(item => item.style.color = aniBlue);
}

function changeOwnBorderColor() {
    // find items -> all 
    let requestItems = document.querySelectorAll("md-list-item");

    // change border color if profile link is not "false"
    requestItems.forEach(item => {
        let profileLink = item.querySelectorAll("a[href*='/profile/']:not([href='/profile/false'])");

        if (profileLink.length > 0) {
            item.style.borderColor = aniBlue
        }
    });
}