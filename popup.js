
/*function init() {
	console.log('popup.js loaded');   
} */

function add() {
    chrome.storage.sync.get('counter', function(data) {
		var counter = 10000;
		if (typeof data['counter'] !== 'undefined'){
			counter = data['counter'];
		}
		chrome.storage.sync.set({'counter' : counter}, function() {});
		
		console.log(counter, document.location.href);
	}); 
	
	
} 


//document.addEventListener('DOMContentLoaded', init);
document.getElementById('addSite').addEventListener('click', add);
