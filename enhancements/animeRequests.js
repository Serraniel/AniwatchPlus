const starIcon = "star";

executeAfterPreload(changeFollowedStarColor);

function changeFollowedStarColor() {
    // find stars
    let followedItems = Array.from(document.querySelectorAll("i")).filter(i => i.innerText == starIcon);

    // change color
    followedItems.forEach(item => item.style.color = aniBlue);
}