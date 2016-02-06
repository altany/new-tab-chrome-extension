function onClickHandler (info, tab) {
	alert(JSON.stringify(info));
}

// Set up context menu at install time.
chrome.runtime.onInstalled.addListener(function() {
	var context = "link";
	var title = "Manage bookmark";
	var id = chrome.contextMenus.create({
		"title": title
		, "contexts":[context]
		//, "documentUrlPatterns": ["*://*.google.com/_/chrome/newtab*"]
		, "id": "context-" + context
	});  
	
	// add click event
	chrome.contextMenus.onClicked.addListener(onClickHandler);
});

