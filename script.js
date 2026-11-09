
document.addEventListener("DOMContentLoaded", function () {

  // HAMBURGER MENU

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("main-nav");

  // Only run if these elements exist on the page
  if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", function () {

      mainNav.classList.toggle("active");

      const isOpen = mainNav.classList.contains("active");

      menuToggle.setAttribute("aria-expanded", isOpen);

      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );

    });

    // Close menu after clicking a navigation link
    mainNav.querySelectorAll("a").forEach(link => {

      link.addEventListener("click", function () {

        mainNav.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");

      });

    });

  }

  // VIEW ALL COURSES
  

  const viewMore = document.getElementById("viewMore");
  const extraBoxes = document.querySelectorAll(".extra-box");

  // Only run on pages that have the View All button
  if (viewMore && extraBoxes.length > 0) {

    viewMore.addEventListener("click", function () {

      const showMore = viewMore.textContent.trim() === "View All";

      extraBoxes.forEach(box => {
        box.hidden = !showMore;
      });

      viewMore.textContent = showMore ? "View Less" : "View All";

    });

  }

  const viewAllBtn = document.getElementById("viewAllBtn");

const extraFaqs = document.querySelectorAll(".extra-faq");

if (viewAllBtn && extraFaqs.length > 0) {

  viewAllBtn.addEventListener("click", function () {

    const showAll = viewAllBtn.textContent.trim() === "View All";

    extraFaqs.forEach(faq => {
      faq.hidden = !showAll;
    });

    viewAllBtn.textContent = showAll ? "View Less" : "View All";

  });

}

});
