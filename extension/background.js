console.log("Thanks for installing Wector! Fork us on GitHub: https://github.com/khaaliDimaag/Wector");

/*
 * Opens the options page whenever the extension is first installed.
 */
chrome.runtime.onInstalled.addListener(function (details) {
	if(details.reason == "install") {
        chrome.runtime.openOptionsPage();
    }
});

/*
 * Fired when location is not set for the first time
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message == 'showOptions') {
  	chrome.runtime.openOptionsPage();
  }
});
