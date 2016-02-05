// Set up context menu at install time.
chrome.runtime.onInstalled.addListener(function() {
	var context = "link";
	var title = "Manage bookmark";
	var id = chrome.contextMenus.create({
		"title": title
		, "contexts":[context]
		, "id": "context" + context
	});  
});

// add click event
/*chrome.contextMenus.onClicked.addListener(onClickHandler);

// The onClicked callback function.
function onClickHandler(info) {
	console.log(info);
};*/