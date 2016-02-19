/* Runs when clicking the toolbar icon */
function init() {
	
	// Attach the event listener to the button
	document.getElementById('addSite').addEventListener('click', add);
	
	// Get the title from the current tab and populate the text field, also select the whole text it to make it easier to edit
	chrome.tabs.getSelected(null,function(tab) {
		$('.popup #title').val(tab.title).select();
	});
}

/* Saving a new bookmark from the toolbar popup */
function add() {
	
	// Get the current counter value from Chrome's storage
    chrome.storage.sync.get('counter', function(data) {
		
		// Set default counter value
		var counter = 10000;
		
		// Unless the counter is undefined (no bookmarks added yet), set to the value from storage
		if (typeof data['counter'] !== 'undefined'){
			counter = data['counter'];
		}
		
		// Update the counter (in case it was undefined)
		chrome.storage.sync.set({'counter' : counter}, function() {});
		
		// Get the current tabs info
		chrome.tabs.getSelected(null,function(tab) {
			
			// Set up the object to save to storage
			var details = {
				title : $('.popup #title').val(),
				
				// Get the active tabs URL
				url : tab.url,
				
				// Get the active tabs favicon
				image : tab.favIconUrl
			};
			
			// Title is compulsory
			if (details.title=='') {
				$('error').css('display', 'block');
				return false;
			}
			
			// Increase the counter
			counter++;		
			
			// Render the new bookmark to the page
			addLink(counter, details.url, details.title);
			
			// Get the new bookmarks position; (0,0)
			details.position = $('#id-'+counter).position();
			
			// Prep for saving in storagge
			var bookmark = {};
			bookmark[counter] = details;
			console.log(bookmark);
			
			// Save the new bookmark to the storage
			chrome.storage.sync.set(bookmark, function() {});
			
			// Update the stored counter value
			chrome.storage.sync.set({'counter' : counter}, function() {});
			
			// Close the popup
			self.close();
		});
		
		
	}); 
	
	
} 

// Attach the event listener on load
document.addEventListener('DOMContentLoaded', init);

var addLink = function(id, url, title, position) {
    console.log('adding link', id, title);
    // Draggables are also droppables so I need to revert when it's dropped on a droppable
	$('#linkList').append('<div id="id-' + id + '" data-id="' + id + '" class="draggable droppable"><a href="' + url + '" target="_blank">' + title + '</a></div>');
    if (typeof position !== "undefined") {
        $('#id-' + id).css({'top': position.top, 'left': position.left}).attr('data-top', position.top).attr('data-left', position.left); 
    }  
    return 'id-' + id;
};
