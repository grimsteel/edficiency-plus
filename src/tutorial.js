const sessionCard = document.getElementById("example-session-card");
const sessionCardDescription = document.getElementById("session-card-description");

function setDescription(description = null) {
  if (description) {
    sessionCardDescription.textContent = description;
  } else {
    sessionCardDescription.textContent = "";
  }
}

sessionCard.addEventListener("mouseover", e => {
  /** @type {HTMLElement} */
  const target = e.target;
  if (target.dataset.desc) {
    setDescription(target.dataset.desc);
  } else {
    setDescription();
  }
});