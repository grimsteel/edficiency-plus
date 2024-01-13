// Basically just update everything to use Bootstrap 5

/**
 * Patch a global function to run a new function after it
 * @param {((...args: any) => any)[]} fns 
 */
function monkeyPatch(fns) {
  // Assume all functions will be loaded at the same time
  if (window[fns[0].name]) {
    fns.forEach(fn => {
      const oldFn = window[fn.name];
      // Overwrite the old function with a new one that also runs the passed in function
      window[fn.name] = function (...args) {
        oldFn(...args);
        fn(...args);
      }
    });
  } else if (document.readyState !== "complete") {
    // If the function isn't loaded yet, wait for it to load
    addEventListener("load", () => monkeyPatch(fns));
  }
}

// input-group-prepend was removed in Bootstrap 5
function removeInputGroupPrepend(el) {
  el.querySelectorAll(".input-group-prepend").forEach(child => {
    if (child.onclick) child.firstElementChild.onclick = child.onclick;
    if (child.hasAttribute("style")) child.firstElementChild.setAttribute("style", child.getAttribute("style"));
    child.replaceWith(child.firstElementChild);
  });
}

// remove bootstrap 4.3.1 and font awesome 4.7.0
document.querySelector("link[rel=stylesheet][href='https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css']")?.remove();
document.querySelector("link[rel=stylesheet][href='https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css']")?.remove();

const bannerBar = document.querySelector("#bannerBar");
const navbar = document.querySelector("#cssmenu");

if (bannerBar && navbar) {
  const oldGreeting = bannerBar.querySelector("small");
  
  // remove the old user name container, and replace the h4 with a happy greeting
  const [, userName] = oldGreeting.lastChild.textContent.match(/^You are logged in as (.+) $/);
  oldGreeting.parentElement.remove();

  bannerBar.querySelector("h4").innerText = "Hello, " + userName + "!";

  // move the navbar to the top
  document.body.insertBefore(navbar, bannerBar);
}

// Edficiency's current assignment card is really ugly. This makes the card look like a normal one
document.querySelectorAll(".card.border.border-dark").forEach(el => {
  el.classList.remove("border", "border-dark", "bg-light");
  el.querySelector(".card-header").classList.remove("bg-dark", "text-white");
  el.querySelector(".card-header").classList.add("p-3");
  el.querySelector(".card-header > h5")?.classList.add("mb-0");
  el.querySelector("h5.text-light")?.classList.remove("text-light");
});

// Login cards - make them look good on dark mode too
document.querySelectorAll(".card.bg-light").forEach(el => {
  el.classList.remove("bg-light");
  el.classList.add("bg-secondary-bg");
});

// Same as above
document.querySelectorAll(".login-btn").forEach(el => {
  el.classList.remove("bg-light");
  el.classList.add("bg-body");
});

removeInputGroupPrepend(document);

// "loading requests" thing
document.querySelectorAll("#requestContainer li").forEach(el => {
  el.classList.remove("border-dark", "bg-white");
  el.classList.add("bg-secondary-bg");
});

if (location.pathname.includes("manage/profile")) {
  // Fix the user profile container
  document.querySelectorAll(".container.bg-light.border.border-dark").forEach(el => {
    el.classList.remove("bg-light", "border", "border-dark", "rounded");
    el.classList.add("bg-secondary-bg", "card");
  });

  // Fix the ugly readonly user profile "inputs"
  document.querySelectorAll(".form-control-sm.border.border-dark.mod.disabled").forEach(el => {
    el.classList.remove("border", "border-dark", "mod", "disabled");
    el.classList.add("form-control");
    el.readOnly = true;
  });

  const teacherPrefOrder = document.getElementById("prefList");

  monkeyPatch([
    function updatePrefList(saved = false) {     
      teacherPrefOrder.classList.remove("bg-secondary", "bg-changed", "bg-secondary-subtle", "border-secondary", "bg-warning-subtle");

      if (saved) {
        teacherPrefOrder.classList.add("bg-secondary-subtle");
      } else {
        teacherPrefOrder.classList.add("bg-warning-subtle");
      }

      teacherPrefOrder.classList.replace("bg-secondary", "bg-secondary-subtle");
      document.querySelectorAll(".teacher").forEach(el => {
        el.classList.remove("bg-light", "bg-white");
        el.firstChild.classList.remove("row");
        el.firstChild.classList.add("d-flex");
      });
    }
  ]);
} else if (location.pathname.includes("requests/requestsessions")) {
  function getSessionData(id) {
    const sessionData = window.sessionDict[id];
    const sessionSizeData = window.sessionsizes[id];
    const numSeats = +sessionData.openseats;
    const numApproved = +sessionSizeData.hinum;
    const numRequested = +sessionSizeData.reqnum;
    const percentApproved = Math.round(numApproved / numSeats * 100);
    const percentRequested = Math.round(numRequested / numSeats * 100);

    return {
      numSeats,
      numApproved,
      numRequested,
      percentApproved,
      percentRequested,
      teacher: sessionData.tname
    };
  }

  // Create a checkbox which toggles whether to show only preferred teachers
  const prefTeachersCheck = document.getElementById("sessionHeader").appendChild(document.createElement("div"));
  prefTeachersCheck.classList.add("form-check", "mb-0", "mt-1");
  const prefTeachersCheckInput = prefTeachersCheck.appendChild(document.createElement("input"));
  prefTeachersCheckInput.classList.add("form-check-input");
  prefTeachersCheckInput.type = "checkbox";
  prefTeachersCheckInput.id = "pref-teachers-check";
  const prefTeachersCheckLabel = prefTeachersCheck.appendChild(document.createElement("label"));
  prefTeachersCheckLabel.classList.add("form-check-label");
  prefTeachersCheckLabel.htmlFor = "pref-teachers-check";
  prefTeachersCheckLabel.innerText = "Only show my teachers";

  // Load the current checkbox state from localStorage
  if (localStorage.getItem("edf-plus-pref-teachers") === "true") {
    prefTeachersCheckInput.checked = true;
    document.getElementById("sessionContainer").classList.add("only-preferred-teachers");
  }

  prefTeachersCheckInput.addEventListener("change", () => {
    // Update the class and save to localStorage
    document.getElementById("sessionContainer").classList.toggle("only-preferred-teachers", prefTeachersCheckInput.checked);
    localStorage.setItem("edf-plus-pref-teachers", prefTeachersCheckInput.checked);
  });

  // Fetch the list of the user's teachers
  const prefTeachersPromise = fetch("/public/ajax/getPrefTeachers.php", {
    method: "POST",
    headers: {
      "X-Requested-With": "XMLHttpRequest"
    }
  }).then(res => res.json());

  monkeyPatch([
    function createSessionList() {
      // Fix borders and spacing on sessions when they are created
      prefTeachersPromise.then(data => {
        const teacherNames = data.result.map(teacher => teacher.name);

        // Stores the day of the last session we looked at
        let currentDay = null;

        document.querySelectorAll(".session").forEach(el => {
          el.classList.remove("bg-light", "border", "border-secondary", "rounded");
          el.classList.add("card", "bg-secondary-bg");
          for (const child of el.children) {
            child.classList.remove("row");
            child.style.removeProperty("margin");
          }
  
          // Add the additional percentages to the badge
          const { numSeats, numApproved, numRequested, percentRequested, teacher } = getSessionData(el.id);

          if (numSeats === 0) {
            // Empty session
            el.classList.add("is-empty-session");
            return;
          }

          const badge = el.lastChild.lastChild.lastChild;

          // people who've already requested are almost guaranteed to get in, so this is a better metric
          badge.textContent += ` (${numRequested}/${numSeats} • ${percentRequested}%)`;
          badge.title = `${numApproved} confirmed / ${numRequested} requested / ${numSeats} seats`;

          if (teacherNames.includes(teacher)) {
            el.classList.add("is-preferred-teacher");
            // Add a teacher icon to the teacher's name
            const teacherIcon = el.children[1].firstChild.appendChild(document.createElement("i"));
            teacherIcon.classList.add("fa", "fa-user", "text-warning-emphasis");
            teacherIcon.title = "One of your teachers";
            teacherIcon.parentElement.classList.add("d-flex", "align-items-center", "gap-2");
          }

          const sessionDay = el.firstChild.firstChild.textContent;

          if (currentDay !== null && currentDay !== sessionDay) {
            // This is a new day, so add a spacer above the session
            // Margin doesn't work if the list is filtered
            const spacer = document.createElement("hr");
            el.insertAdjacentElement("beforebegin", spacer);
          }

          currentDay = sessionDay;
        });
      });
    },

    function clickSession(session) {
      // Apply our changes to the expanded sessions

      /** @type {HTMLElement}  */
      const sessionEl = session.get(0);

      if (!sessionEl) return;

      sessionEl.querySelectorAll(".row").forEach(el => {
        el.classList.remove("row");
        el.style.removeProperty("margin");
      });

      removeInputGroupPrepend(sessionEl);

      const detailsItem = sessionEl.querySelector(".sessionRequestOptions").firstElementChild;
      detailsItem.firstElementChild.classList.add("font-weight-bold");
      detailsItem.firstElementChild.firstElementChild.classList.add("font-weight-normal");

      const statsItem = detailsItem.insertAdjacentElement("afterend", document.createElement("div"));
      statsItem.classList.add("mb-2", "px-2", "mt-2");
      const statsHeader = statsItem.appendChild(document.createElement("span"));
      statsHeader.classList.add("font-weight-bold");
      statsHeader.textContent = "Stats: ";
      const statsText = statsItem.appendChild(document.createElement("em"));

      const { numSeats, numApproved, numRequested, percentApproved, percentRequested } = getSessionData(sessionEl.id);

      statsText.textContent = `${numApproved} confirmed (${percentApproved}%) / ${numRequested} requested (${percentRequested}%) / ${numSeats} total seats`;

      sessionEl.querySelector("#helpIcon")?.classList.remove("bg-white");
      sessionEl.querySelector("#helpNeeded")?.classList.remove("border-secondary");
      sessionEl.querySelector("#helpNeeded")?.classList.add("align-items-center");

      sessionEl.querySelector("#helpNeeded > div.my-auto").textContent = "Help Needed?";
      sessionEl.querySelector("#helpNeeded > div.my-auto").classList.add("mr-1");

      const lowButton = sessionEl.querySelector("#lowButton");
      const highButton = sessionEl.querySelector("#highButton");

      lowButton.textContent = "Normal Request";
      highButton.textContent = "Priority Request";

      lowButton.classList.replace("btn-outline-primary", "btn-primary");
    },

    function createRequestList() {
      // Fix borders and spacing on requests when they are created

      let currentDayOfWeek = null;

      document.querySelectorAll(".request-date").forEach((el, i) => {
        el.classList.remove("bg-white", "border", "border-dark", "rounded");
        el.classList.add("card", "bg-secondary-bg");
        // Date header
        el.firstElementChild.classList.remove("bg-secondary", "text-white", "rounded", "p-2");
        el.firstElementChild.classList.add("alert", "alert-secondary", "py-2");

        removeInputGroupPrepend(el);

        el.lastElementChild.classList.remove("p-1");
        el.querySelector(".input-group").classList.remove("ml-1", "border", "border-secondary");
        const formControl = el.querySelector(".form-control");
        formControl.classList.add("align-items-center", "d-flex", "flex-wrap");
        formControl.classList.replace("bg-warning", "bg-warning-subtle");

        // Add the confirmed/not confirmed badge
        const rosterEntry = window.roster[i];
        const requestData = window.serverData.requests.find(request => window.sessionDict[request.sessionid].date === rosterEntry.date);
        
        const date = new Date(Date.parse(`${rosterEntry.date}T00:00`));
        const dayOfWeek = date.getDay();

        if (requestData) {
          const session = window.sessionDict[requestData.sessionid];
          const sessionSizeData = window.sessionsizes[requestData.sessionid];
          const isConfirmed = requestData.pendingconfirm === "1"; // these edficiency people do not know how to use booleans
          const isOnWaitlist = !isConfirmed && +session.openseats <= +sessionSizeData.reqnum;
          
          const confirmedBadge = document.createElement("span");
          confirmedBadge.classList.add("badge", `badge-${isConfirmed ? "success" : isOnWaitlist ? "danger" : "warning"}`);
          confirmedBadge.title = isConfirmed ? "Confirmed" : "Not yet confirmed";
          const icon = confirmedBadge.appendChild(document.createElement("i"));
          // Show a checkmark if confirmed, an exclamation mark if on waitlist, and a clock if not confirmed
          icon.classList.add("fa", `fa-${isConfirmed ? "circle-check" : isOnWaitlist ? "circle-exclamation" : "clock"}`);
          formControl.prepend(confirmedBadge, "\u00a0"); // &nbsp;
        }

        if (dayOfWeek < currentDayOfWeek) {
          // This is a new week, so add a spacer
          // Margin doesn't work if the list is filtered
          const spacer = document.createElement("hr");
          el.insertAdjacentElement("beforebegin", spacer);
        }

        currentDayOfWeek = dayOfWeek;
      });
    }
  ]);
}

