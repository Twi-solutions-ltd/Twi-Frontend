const viewMore = document.getElementById("viewMore");

const extraBoxes = document.querySelectorAll(".extra-box");

viewMore.addEventListener("click", function () {

  const showMore = viewMore.textContent.trim() === "View All";

  extraBoxes.forEach(box => {
    box.hidden = !showMore;
  });

  viewMore.textContent = showMore ? "View Less" : "View All";

});