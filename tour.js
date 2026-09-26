/**
 * TOUR ENGINE
 * ------------------------------------------------------------------
 * Loads the real report in an iframe and drives a linear, click-blocked
 * walkthrough over it. Never modifies the report file itself — everything
 * here reaches INTO the iframe from the outside, so re-exporting the
 * report from Claude Design won't break this as long as the handful of
 * anchor points (see tour-steps.js) still exist in the new export.
 *
 * ANALYTICS: swap HUBSPOT_PORTAL_ID below for the real portal ID when
 * ready. Until then, trackEvent() no-ops safely (checks for _hsq).
 */

const HUBSPOT_PORTAL_ID = "REPLACE_ME"; // TODO: set before shipping externally

let currentStep = 0;
let iframeDoc = null;
let iframeWin = null;
let raf = null;
let modalOpenedBy = null; // tracks which step (if any) has an in-report modal open

const overlay = document.getElementById("tour-overlay");
const spotlight = document.getElementById("tour-spotlight");
const modal = document.getElementById("tour-modal");
const reportFrame = document.getElementById("report-frame");

function trackEvent(name, props = {}) {
  try {
    window._hsq = window._hsq || [];
    window._hsq.push(["trackEvent", { id: name, value: props }]);
  } catch (e) {
    /* no-op if HubSpot isn't loaded yet */
  }
  // Always log locally too, so you can sanity-check events before HubSpot is wired in
  console.log("[tour event]", name, props);
}

function findByText(doc, tag, text) {
  const candidates = Array.from(doc.querySelectorAll(tag)).filter(
    (el) => el.textContent.trim() === text
  );
  // Prefer the most specific (leaf) match
  return candidates.find((el) => el.children.length === 0) || candidates[0] || null;
}

function findTarget(step) {
  if (!step.find) return null;
  if (step.find.type === "data") {
    if (step.find.value === "q") {
      return iframeDoc.querySelector("[data-q]");
    }
    return iframeDoc.querySelector(`[data-tour="${step.find.value}"]`);
  }
  if (step.find.type === "text") {
    return findByText(iframeDoc, step.find.tag || "span", step.find.value);
  }
  return null;
}

function switchTab(tab) {
  if (!tab) return Promise.resolve();
  const label = tab === "prepare" ? "Prepare for Instruction" : "Review Performance";
  const tabEl = findByText(iframeDoc, "span", label);
  if (tabEl) tabEl.click();
  // give the app a beat to re-render after the tab switch
  return new Promise((resolve) => setTimeout(resolve, 250));
}

function closeAnyOpenModal() {
  // All in-report modals (Questions, Predicted Strengths/Challenges info, etc.)
  // share this same backdrop wrapper, and React only ever mounts the one that's
  // currently open — so this reliably targets "whatever's open right now"
  // without needing to know which specific modal it is.
  const backdrop = iframeDoc.querySelector(
    '[style*="position:fixed; inset:0; z-index:50"]'
  );
  if (backdrop) backdrop.click();
}

function runBeforeShow(step) {
  if (step.beforeShow === "openQuestionModal") {
    const q = iframeDoc.querySelector("[data-q]");
    if (q) q.click();
    modalOpenedBy = step.id;
    return new Promise((resolve) => setTimeout(resolve, 250));
  }
  return Promise.resolve();
}

function positionSpotlight(target) {
  if (!target) {
    spotlight.style.display = "none";
    return;
  }
  spotlight.style.display = "block";
  const frameRect = reportFrame.getBoundingClientRect();
  const rect = target.getBoundingClientRect();
  const pad = 8;
  spotlight.style.top = `${frameRect.top + rect.top - pad}px`;
  spotlight.style.left = `${frameRect.left + rect.left - pad}px`;
  spotlight.style.width = `${rect.width + pad * 2}px`;
  spotlight.style.height = `${rect.height + pad * 2}px`;
}

function positionModal(target) {
  const modalRect = modal.getBoundingClientRect();
  if (!target) {
    // centered intro/outro
    modal.style.top = `50%`;
    modal.style.left = `50%`;
    modal.style.transform = `translate(-50%, -50%)`;
    return;
  }
  modal.style.transform = "none";
  const frameRect = reportFrame.getBoundingClientRect();
  const rect = target.getBoundingClientRect();
  const spaceBelow = window.innerHeight - (frameRect.top + rect.bottom);
  let top;
  if (spaceBelow > modalRect.height + 40) {
    top = frameRect.top + rect.bottom + 20;
  } else {
    top = frameRect.top + rect.top - modalRect.height - 20;
  }
  let left = frameRect.left + rect.left;
  left = Math.min(Math.max(left, 20), window.innerWidth - modalRect.width - 20);
  // Hard clamp as a fallback — even if scrollIntoView or a future edge case
  // produces a bad `top`, the modal can never render fully off-screen.
  top = Math.min(Math.max(top, 20), window.innerHeight - modalRect.height - 20);
  modal.style.top = `${Math.max(top, 20)}px`;
  modal.style.left = `${left}px`;
}

async function renderStep(index) {
  const step = TOUR_STEPS[index];

  // Close any modal a previous step opened — this was the step-5 bug: the
  // Questions modal from step 3 stayed open and blocked everything after it.
  if (modalOpenedBy && modalOpenedBy !== step.id) {
    closeAnyOpenModal();
    modalOpenedBy = null;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  currentStep = index;

  await switchTab(step.tab);
  await runBeforeShow(step);

  const target = findTarget(step);

  // Bring the target into view inside the iframe before measuring its position —
  // without this, a target below the fold produces off-screen coordinates and
  // the modal renders off-screen along with it. This was the step-5 bug.
  if (target && target.scrollIntoView) {
    target.scrollIntoView({ block: "center", inline: "nearest" });
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  positionSpotlight(target);
  positionModal(target);

  document.getElementById("tour-step-count").textContent = `STEP ${index + 1} OF ${TOUR_STEPS.length}`;
  document.getElementById("tour-title").textContent = step.title;
  document.getElementById("tour-body").textContent = step.body;
  document.getElementById("tour-back").style.visibility = index === 0 ? "hidden" : "visible";
  document.getElementById("tour-next").textContent = step.isClose ? "Explore more" : index === 0 ? "Start" : "Next";

  trackEvent("tour_step_viewed", { step: step.id, index: index + 1 });
}

function nextStep() {
  if (currentStep >= TOUR_STEPS.length - 1) {
    trackEvent("tour_completed", { totalSteps: TOUR_STEPS.length });
    // TODO: hook up real CTA destinations here (book time / explore more)
    return;
  }
  renderStep(currentStep + 1);
}

function prevStep() {
  if (currentStep === 0) return;
  renderStep(currentStep - 1);
}

function trackAbandonIfIncomplete() {
  if (currentStep < TOUR_STEPS.length - 1) {
    trackEvent("tour_abandoned", { lastStep: TOUR_STEPS[currentStep].id, index: currentStep + 1 });
  }
}

window.addEventListener("beforeunload", trackAbandonIfIncomplete);

document.getElementById("tour-next").addEventListener("click", nextStep);
document.getElementById("tour-back").addEventListener("click", prevStep);
document.getElementById("tour-close").addEventListener("click", trackAbandonIfIncomplete);

reportFrame.addEventListener("load", () => {
  iframeDoc = reportFrame.contentDocument;
  iframeWin = reportFrame.contentWindow;
  // give the report's own JS a moment to finish its first render
  setTimeout(() => renderStep(0), 600);
});

// keep spotlight/modal aligned on scroll/resize
window.addEventListener("resize", () => {
  const step = TOUR_STEPS[currentStep];
  if (!step) return;
  const target = findTarget(step);
  positionSpotlight(target);
  positionModal(target);
});
