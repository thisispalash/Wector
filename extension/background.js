chrome.runtime.onInstalled.addListener(function callback() {
	chrome.runtime.openOptionsPage();
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message == 'showOptions') {
  	chrome.runtime.openOptionsPage();
  }
});