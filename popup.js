// Called when the user clicks on the browser action.
/*chrome.browserAction.onClicked.addListener(function(tab) {
    console.log('need to add this to chrome.storage');
});*/

function init() {
	console.log('popup.js loaded');   
} 

function add() {
    chrome.storage.sync.get('counter', function(data) {
		
		if (typeof data['counter'] !== 'undefined'){
			counter = data['counter'];
		}
		
		storage.set({'counter' : counter}, function() {});
		
		chrome.tabs.executeScript({
			code: 'var counter = ' + data['counter']
			}, function() {
			chrome.tabs.executeScript({file: 'tab.js'});
		});
	}); 
	
	
} 


document.addEventListener('DOMContentLoaded', init);
document.getElementById('addSite').addEventListener('click', add);
