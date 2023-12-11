const sessionCard = document.getElementById("example-session-card");
const sessionCardDescription = document.getElementById("session-card-description");
const requestCard = document.getElementById("example-request-card");
const requestCardDescription = document.getElementById("request-card-description");
const requestCardIconTypes = [
  document.getElementById("request-card-confirmed"),
  document.getElementById("request-card-not-confirmed"),
  document.getElementById("request-card-waitlist")
];
let currentRequestCardIcon = 0;

sessionCard.addEventListener("mouseover", e => {
  /** @type {HTMLElement} */
  const target = e.target;
  sessionCardDescription.textContent = target.dataset.desc || "";
});

requestCard.addEventListener("mouseover", e => {
  /** @type {HTMLElement} */
  const target = e.target;
  requestCardDescription.textContent = target.dataset.desc || "";
});

// Cycle the request card
setInterval(() => {
  requestCardIconTypes[currentRequestCardIcon].hidden = true;
  currentRequestCardIcon = (currentRequestCardIcon + 1) % requestCardIconTypes.length;
  requestCardIconTypes[currentRequestCardIcon].hidden = false;
}, 5000);