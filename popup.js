function init() {
	
	document.getElementById('addSite').addEventListener('click', add);
	chrome.tabs.getSelected(null,function(tab) {
		$('.popup #title').val(tab.url).select();
	});
}

function add() {
    chrome.storage.sync.get('counter', function(data) {
		var counter = 10000;
		if (typeof data['counter'] !== 'undefined'){
			counter = data['counter'];
		}
		chrome.storage.sync.set({'counter' : counter}, function() {});
		
		chrome.tabs.getSelected(null,function(tab) {
			var details = {
				title : $('.popup #title').val(),
				url : tab.url
			};

			if (details.title=='') {
				alert('Please enter a title for your bookmark');
				return false;
			}
			counter++;		

			addLink(counter, details.url, details.title);

			details.position = $('#id-'+counter).position();
			var bookmark = {};
			bookmark[counter] = details;
			console.log(bookmark);
			chrome.storage.sync.set(bookmark, function() {});

			chrome.storage.sync.set({'counter' : counter}, function() {});
			self.close();
		});
		
		
	}); 
	
	
} 


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
