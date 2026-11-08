const viewMore = document.getElementById("viewMore");

const extraBoxes = document.querySelectorAll(".extra-box");

viewMore.addEventListener("click", function () {

  const showMore = viewMore.textContent.trim() === "View All";

  extraBoxes.forEach(box => {
    box.hidden = !showMore;
  });

  viewMore.textContent = showMore ? "View Less" : "View All";

});

const viewAllBtn = document.getElementById("viewAllBtn");
const extraQuestions = document.querySelectorAll(".extra-faq");

let isExpanded = false;

viewAllBtn.addEventListener("click", function () {

  isExpanded = !isExpanded;

  extraQuestions.forEach(function (question) {
    question.classList.toggle("show", isExpanded);
  });

  viewAllBtn.textContent = isExpanded ? "View Less" : "View All";

});