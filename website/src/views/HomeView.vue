<template>
    <Cover />
    <main>
      <div class="divider"></div>
    <div class="container col-xxl-8 px-4 py-5">
      <div class="row flex-lg-row-reverse align-items-center g-5 py-5">
        <div class="col-10 col-sm-8 col-lg-6">
          <div id="example-session-card" class="py-1 shadow mb-2 scroll-snap-element card bg-secondary-bg">
            <div class="px-2 d-flex justify-content-between small pe-none">
              <div>Monday, December 11th</div>
            </div>
            <div class="px-2 d-flex justify-content-between pe-none">
              <div class="font-weight-bold d-flex align-items-center gap-2">
                KAMESWAR, SIDDHANT
                <div class="highlighted pe-auto" data-desc="This icon provides an easy way to recognize your teachers in the full session list." title="One of your teachers">
                  <span class="text-warning-emphasis pe-none"><i class="fa-solid fa-user" width="10" height="12"></i></span>
                </div>
              </div>
              <div><em>Earth</em></div>
            </div>
            <div class="px-2 d-flex justify-content-between">
              <div class="pe-none">FLEX</div>
              <div class="highlighted ml-1"><span class="badge badge-warning" title="6 approved / 7 requested / 8 seats" data-desc="Hovering over this badge reveals the exact session occupancy numbers.">Filling Up (<span data-desc="The number of confirmed/approved requests as a percentage of the total number of seats.">75%</span> / <span data-desc="The total number of requests as a percentage of the total number of seats">88%</span>)</span></div>
            </div>
            <div class="sessionRequestOptions">
              <div class="px-2 mb-1 pe-none">
                <span class="font-weight-bold">Details: </span>
                <em>Let's make friendship bracelets!</em>
              </div>
              <div class="px-2 mb-2 highlighted" data-desc="When the session card is expanded, session occupancy numbers and percentages can also be viewed here.">
                <span class="font-weight-bold pe-none">Stats: </span>
                <em class="pe-none">6 confirmed (75%) / 7 requested (88%) / 8 total seats</em>
              </div>
              <div class="px-2 d-flex justify-content-between mt-2 pe-none">
                <div id="helpNeeded" value="0" class="d-flex border rounded px-1 align-items-center">
                  <div class="my-auto">Help Needed:&nbsp;</div><span id="helpIcon"><i class="fa-regular fa-square" width="10" height="12"></i></span>
                </div>
                <div>
                  <button class="btn btn-sm btn-outline-primary mr-1">Request Low</button>
                  <button class="btn btn-sm btn-outline-primary ml-1" title="High priority requests require a note">Request High</button></div>
              </div>
              <div class="px-2 d-flex justify-content-between mb-1">
                <div class="input-group input-group-sm mb-1 mt-2 w-100"><span class="input-group-text">Note:</span><input type="text" class="form-control"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <h1 class="display-5 font-weight-bold text-body-emphasis lh-1 mb-3">See more about your sessions</h1>
          <p class="lead">
            Get valuable information about your session, including the number of requests, seats, and confirmed requests, so you're always in the know.
          </p>
          <p class="lead fst-italic" id="session-card-description"></p>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="container col-xxl-8 px-4 py-5">
      <div class="row flex-lg-row align-items-center g-5 py-5">
        <div class="col-10 col-sm-8 col-lg-6">
          <div class="shadow p-2 my-1 card bg-secondary-bg" id="example-request-card">
            <div class="alert alert-secondary py-2">Tuesday, December 12th</div>
            <div class="d-flex my-auto h-100">
              <div class="input-group rounded shadow-sm pe-none">
                <span class="input-group-text">
                  <span class="text-danger" title="Delete Request"><i class="fa-solid fa-circle-minus" width="14" height="14"></i></span>
                </span>
                <div class="form-control align-items-center d-flex flex-wrap" data-toggle="tooltip" data-html="true" title="">
                  <div class="highlighted">
                    <span class="badge badge-success pe-auto" id="request-card-confirmed" title="Confirmed" data-desc="A check signifies your request is approved. Note: low priority requests may be unconfirmed if necessary.">
                      <span class="pe-none"><i class="fa-solid fa-circle-check" width="12" height="12"></i></span>
                    </span>
                    <span class="badge badge-warning pe-auto" hidden id="request-card-not-confirmed" title="Not yet confirmed" data-desc="A clock signifies your request is not yet approved, but will likely be soon.">
                      <span class="pe-none"><i class="fa-solid fa-clock" width="12" height="12"></i></span>
                    </span>
                    <span class="badge badge-danger pe-auto" hidden id="request-card-waitlist" title="Not yet confirmed" data-desc="An exclamation signifies your request will be approved when there is space. (Waitlist)">
                      <span class="pe-none"><i class="fa-solid fa-circle-exclamation" width="12" height="12"></i></span>
                    </span>
                  </div>
                  &nbsp;
                  <span class="badge badge-primary">H</span>
                  &nbsp;
                  <span><i class="fa-regular fa-hand" width="14" height="14"></i></span>
                  &nbsp;
                  <span><i class="fa-solid fa-comment-dots" width="14" height="14"></i></span>
                  &nbsp;
                  GUPTA, RUHAN (The Moon)
                  &nbsp;
                  <em>FLEX</em>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <h1 class="display-5 font-weight-bold text-body-emphasis lh-1 mb-3">Get insights on your session requests</h1>
          <p class="lead">
            A new badge allows you to view which sessions are approved quickly.
          </p>
          <p class="lead fst-italic" id="request-card-description"></p>
        </div>
        </div>
        </div>
      <div class="divider"></div>

      <div class="container col-xxl-8 px-4 py-5">
        <div class="row flex-lg-row align-items-center g-5 py-5">
        <div class="col-lg-6">
          <h1 class="display-5 font-weight-bold text-body-emphasis lh-1 mb-3">Redesigned, with <span style="display: inline-block">dark mode</span></h1>
          <p class="lead">
            Edficiency+ redesigns the Edficiency website for an improved user experience and to support new features. And, of course, it comes with a dark mode. Just change your system theme!
          </p>
          <p class="lead fst-italic" id="request-card-description"></p>
          
        </div>
        <div class="col-10 col-sm-8 col-lg-6">
          <li class="shadow p-2 my-1 card bg-primary-bg" data-bs-theme="light">
            <div class="alert alert-secondary py-2" style="background-color: #e2e3e5 !important; border-color: #c4c8cb !important; color:black !important;">Wednesday, December 13th</div>
            <div class="d-flex my-auto h-100">
              <div class="input-group rounded">
                <span class="input-group-text" style="background-color: #f8f9fa !important">
                  <span><i class="fa-solid fa-magnifying-glass" width="14" height="14" style="color: black !important;"></i></span>
                </span>
                <input type="text" class="form-control align-items-center d-flex flex-wrap" placeholder="">
              </div>
            </div>
          </li>
          <br>
          <li class="shadow p-2 my-1 card bg-primary-bg" style="background-color: #2a2f34 !important; transform: translateX(60px); margin-right: 1rem;" data-bs-theme="dark">
            <div class="alert alert-secondary py-2" style="background-color: #161719 !important; border-color: #212529 !important; color:#a7acb1 !important;">Thursday, December 14th</div>
            <div class="d-flex my-auto h-100">
              <div class="input-group rounded" style="color: white !important; ">
                <span class="input-group-text" style="background-color: #2b3035 !important; border-color: #495057;">
                  <span><i class="fa-solid fa-magnifying-glass" width="14" height="14" style="color:#dee2e6"></i></span>
                </span>
                <input type="text" class="form-control align-items-center d-flex flex-wrap" placeholder="" style="background-color: #212529 !important; border-color: #495057; ">
              </div>
            </div>
          </li>
        </div>
        </div>
      </div>
      
    <!-- </div> -->
    
  </main>
</template>

<script setup>
import Cover from "../components/Cover.vue";
import { onMounted } from "vue";

onMounted(() => {
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
});

</script>