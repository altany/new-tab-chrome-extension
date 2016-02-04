// Called when the user clicks on the browser action.
/*chrome.browserAction.onClicked.addListener(function(tab) {
    console.log('need to add this to chrome.storage');
});*/

function init() {
    console.log('popup.js loaded');
    
} 

function add() {
    console.log('add button clickeds');
    
} 


document.addEventListener('DOMContentLoaded', init);
document.getElementById('addSite').addEventListener('click', add);
