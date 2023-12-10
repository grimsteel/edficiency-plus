chrome.action.onClicked.addListener(() => {
  // Open the tutorial
  chrome.tabs.create({ url: chrome.runtime.getURL("tutorial.html") });
});

chrome.runtime.onInstalled.addListener(details => {
  // Open the tutorial
  if (details.reason === "install")
    chrome.tabs.create({ url: chrome.runtime.getURL("tutorial.html") });
});