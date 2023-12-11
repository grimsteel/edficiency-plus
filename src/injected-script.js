// Basically just update everything to use Bootstrap 5

document.querySelector("link[rel=stylesheet][href='https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css']")?.remove();

// get the user's name
userName = document.querySelector("small")?.innerText.substring(21);

// remove the old user name container, and replace the h4 with a happy greeting
document.querySelector(".col.col-md-4.col-lg-3")?.remove();
document.querySelector("h4").innerText = "Hello, " + userName + "!";

// give the navbar styles
document.querySelector("#cssmenu").style.position = "fixed";
document.querySelector("#cssmenu").style.width = "100%";
document.querySelector("#cssmenu").style.top = "0";
document.querySelector("#cssmenu").style.background = "#343a40";
document.querySelector("#cssmenu").style.height = "auto";
document.querySelector("#cssmenu").style.boxShadow = "none";

// the auto-height of the navbar, and add 10px of margin
var cssmenuHeight = document.querySelector("#cssmenu").offsetHeight + 10;

document.querySelector("#bannerBar").style.marginTop = cssmenuHeight + "px";

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

// input-group-prepend was removed in Bootstrap 5
document.querySelectorAll(".input-group-prepend").forEach(el => {
  el.replaceWith(el.firstElementChild);
});

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

  addEventListener("load", () => {
    const oldUpdatePrefList = window.updatePrefList;
    window.updatePrefList = function (saved = false) {
      oldUpdatePrefList(saved);
      
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
  })
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
      percentRequested
    };
}
  addEventListener("load", () => {
    const oldCreateSessionList = window.createSessionList;
    const oldClickSession = window.clickSession;
    const oldCreateRequestList = window.createRequestList;

    // Fix borders and spacing on sessions when they are created
    window.createSessionList = function () {
      oldCreateSessionList();

      document.querySelectorAll(".session").forEach(el => {
        el.classList.remove("bg-light", "border", "border-secondary", "rounded");
        el.classList.add("card", "bg-secondary-bg");
        for (const child of el.children) {
          child.classList.remove("row");
          child.style.removeProperty("margin");
        }

        // Add the additional percentages to the badge
        const { numSeats, numApproved, numRequested, percentApproved, percentRequested } = getSessionData(el.id);
        el.querySelector(".badge").innerText += ` (${percentApproved}% / ${percentRequested}%)`;
        el.querySelector(".badge").title = `${numApproved} confirmed / ${numRequested} requested / ${numSeats} seats`;
      });
    }

    // Apply our changes to the expanded sessions
    window.clickSession = function (session) {
      oldClickSession(session);
      /** @type {HTMLElement}  */
      const sessionEl = session.get(0);

      sessionEl.querySelectorAll(".row").forEach(el => {
        el.classList.remove("row");
        el.style.removeProperty("margin");
      });

      sessionEl.querySelectorAll(".input-group-prepend").forEach(el => {
        el.replaceWith(el.firstElementChild);
      });

      const detailsItem = sessionEl.querySelector(".sessionRequestOptions").firstElementChild;
      detailsItem.firstElementChild.classList.add("font-weight-bold");
      detailsItem.firstElementChild.firstElementChild.classList.add("font-weight-normal");

      const statsItem = detailsItem.insertAdjacentElement("afterend", document.createElement("div"));
      statsItem.classList.add("mb-2", "px-2");
      const statsHeader = statsItem.appendChild(document.createElement("span"));
      statsHeader.classList.add("font-weight-bold");
      statsHeader.innerText = "Stats: ";
      const statsText = statsItem.appendChild(document.createElement("span"));

      const { numSeats, numApproved, numRequested, percentApproved, percentRequested } = getSessionData(sessionEl.id);

      statsText.innerText = `${numApproved} confirmed (${percentApproved}%) / ${numRequested} requested (${percentRequested}%) / ${numSeats} total seats`;

      sessionEl.querySelector("#helpIcon")?.classList.remove("bg-white");
      sessionEl.querySelector("#helpNeeded")?.classList.remove("border-secondary");
      sessionEl.querySelector("#helpNeeded")?.classList.add("align-items-center");
    }

    // Fix borders and spacing on requests when they are created
    window.createRequestList = function () {
      oldCreateRequestList();

      document.querySelectorAll(".request-date").forEach((el, i) => {
        el.classList.remove("bg-white", "border", "border-dark", "rounded");
        el.classList.add("card", "bg-secondary-bg");
        // Date header
        el.firstElementChild.classList.remove("bg-secondary", "text-white", "rounded", "p-2");
        el.firstElementChild.classList.add("alert", "alert-secondary", "py-2");

        el.querySelectorAll(".input-group-prepend").forEach(child => {
          child.replaceWith(child.firstElementChild);
        });

        el.lastElementChild.classList.remove("p-1");
        el.querySelector(".input-group").classList.remove("ml-1", "border", "border-secondary");
        const formControl = el.querySelector(".form-control");
        formControl.classList.add("align-items-center", "d-flex", "flex-wrap");
        formControl.classList.replace("bg-warning", "bg-warning-subtle");

        // Add the confirmed/not confirmed badge
        const rosterEntry = window.roster[i];
        const requestData = window.serverData.requests.find(request => window.sessionDict[request.sessionid].date === rosterEntry.date);

        if (requestData) {
          const session = window.sessionDict[requestData.sessionid];
          const sessionSizeData = window.sessionsizes[requestData.sessionid];
          const isConfirmed = requestData.pendingconfirm === "1"; // these edficiency people do not know how to use booleans
          const isOnWaitlist = !isConfirmed && +session.openseats <= +sessionSizeData.reqnum;
          
          const confirmedBadge = document.createElement("span");
          confirmedBadge.classList.add("badge", `badge-${isConfirmed ? "success" : "warning"}`);
          confirmedBadge.title = isConfirmed ? "Confirmed" : "Not yet confirmed";
          const icon = confirmedBadge.appendChild(document.createElement("i"));
          // Show a checkmark if confirmed, an exclamation mark if on waitlist, and a clock if not confirmed
          icon.classList.add("fa", `fa-${isConfirmed ? "check" : isOnWaitlist ? "exclamation" : "clock-o"}`);
          formControl.prepend(confirmedBadge, "\u00a0"); // &nbsp;
        }
      });
    }
  });
}

