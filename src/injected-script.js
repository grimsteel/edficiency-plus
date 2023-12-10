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
}

