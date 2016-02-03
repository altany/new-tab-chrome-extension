// Called when the user clicks on the browser action.
/*chrome.browserAction.onClicked.addListener(function(tab) {
    console.log('need to add this to chrome.storage');
});*/

function init() {
    $('body').css('background-image', 'none');
    console.log('popup.js loaded');
    
} 


document.addEventListener('DOMContentLoaded', init);
