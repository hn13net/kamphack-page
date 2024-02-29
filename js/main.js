function toggleMenu() {
    const topnav = document.querySelector(".topnav");
    if (topnav.className === "topnav") {
        topnav.className += " responsive";
    } else {
        topnav.className = "topnav";
    }
}

document.addEventListener('click', function (event) {
    if (document.querySelectorAll(".topnav.responsive").length > 0 && (event.target.className !== "icon" && event.target.parentElement.className !== "icon" && event.target.parentElement.parentElement.className !== "icon")) {
        toggleMenu();
    }
});