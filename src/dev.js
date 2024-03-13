let removeElementInterval;
const removeElementDelay = 5000; // Set the delay as per your requirement

function breakPointToolRemoveResizerElement() {
  const element = document.getElementById("resizerElement");
  if (element) {
    element.parentNode.removeChild(element);
  }
}

window.addEventListener("resize", function () {
  const currentWidth = window.innerWidth;

  if (!document.getElementById("resizerElement")) {
    const responsiveSizeElTemplate = document.getElementById(
      "responsiveSizeElTemplate",
    );
    const responsiveSizeEl = document.importNode(
      responsiveSizeElTemplate.content,
      true,
    );
    const responsiveSizeTemplate = document.getElementById(
      "responsiveSizeTemplate",
    );
    const responsiveSizeNode = document.importNode(
      responsiveSizeTemplate.content,
      true,
    );
    const resizerElement = responsiveSizeEl.querySelector("#resizerElement");
    responsiveSizeNode.querySelector("#currentWidth").textContent =
      currentWidth;
    resizerElement.appendChild(responsiveSizeNode);
    document.body.appendChild(responsiveSizeEl);
    setTimeout(function () {
      document
        .getElementById("resizerElementCloseButton")
        .addEventListener("click", function () {
          breakPointToolRemoveResizerElement();
        });
      resizerElement.classList.remove("-translate-y-full");
      resizerElement.classList.add("mt-3");
    }, 1);
  }

  document.getElementById("currentWidth").innerText = currentWidth;

  clearInterval(removeElementInterval);
  removeElementInterval = setInterval(function () {
    breakPointToolRemoveResizerElement();
  }, removeElementDelay);
});
