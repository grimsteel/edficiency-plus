// Basically just update everything to use Bootstrap 5

document.querySelector("link[rel=stylesheet][href='https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css']")?.remove();

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
  const sessionContainer = document.getElementById("sessionContainer");
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
        const sessionData = window.sessionDict[el.id];
        const sessionSizeData = window.sessionsizes[el.id];
        const numSeats = +sessionData.openseats;
        const numApproved = +sessionSizeData.hinum;
        const numRequested = +sessionSizeData.reqnum;
        const percentApproved = Math.round(numApproved / numSeats * 100);
        const percentRequested = Math.round(numRequested / numSeats * 100);
        el.querySelector(".badge").innerText += ` (${percentApproved}% / ${percentRequested}%)`;
        el.querySelector(".badge").title = `${numApproved} approved / ${numRequested} requested / ${numSeats} seats`;
      });
    }

    // Apply our changes to the expanded sessions
    window.clickSession = function (session) {
      oldClickSession(session);
      const sessionEl = session.get(0);

      sessionEl.querySelectorAll(".row").forEach(el => {
        el.classList.remove("row");
        el.style.removeProperty("margin");
      });

      sessionEl.querySelectorAll(".input-group-prepend").forEach(el => {
        el.replaceWith(el.firstElementChild);
      });

      sessionEl.querySelector("#helpIcon")?.classList.remove("bg-white");
      sessionEl.querySelector("#helpNeeded")?.classList.remove("border-secondary");
      sessionEl.querySelector("#helpNeeded")?.classList.add("align-items-center");
    }

    // Fix borders and spacing on requests when they are created
    window.createRequestList = function () {
      oldCreateRequestList();

      document.querySelectorAll(".request-date").forEach(el => {
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
        el.querySelector(".form-control").classList.add("align-items-center", "d-flex", "flex-wrap");
      });
    }
  });
}

