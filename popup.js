function init() {
	
	console.log('loaded');
	document.getElementById('addSite').addEventListener('click', add); 
}

function add() {
    chrome.storage.sync.get('counter', function(data) {
		var counter = 10000;
		if (typeof data['counter'] !== 'undefined'){
			counter = data['counter'];
		}
		chrome.storage.sync.set({'counter' : counter}, function() {});
		
		console.log(counter, document.location.href, $('#title'));
		var details = {
			title : $('#title').val(),
			url : document.location.href
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
	}); 
	
	
} 


document.addEventListener('DOMContentLoaded', init);

var addLink = function(id, url, title, position) {
    console.log('adding link', id, title);
    // Draggables are also droppables so I need to revert when it's dropped on a droppable
	$('#linkList').append('<div id="id-' + id + '" data-id="' + id + '" class="draggable droppable"><a href="' + url + '" target="_blank">' + title + '</a></div>');
    if (typeof position !== "undefined") {
        $('#id-' + id).css({'top': position.top, 'left': position.left}); 
    }
    /*$( '.draggable' ).draggable({
        containment: 'parent'
        , cursor: 'move'
        , revert: function (valid) {
            if (!valid) { //Dropped on non-droppable so it's safe to store the new location
                var storage = chrome.storage.sync;
                
                // Save new location here
                var bookmark = {};
                var details = {
                    title : title,
                    url : url,
                    position : {'left': $(this).position().left, 'top' : $(this).position().top}
                };
                console.log({'left': $(this).position().left, 'top' : $(this).position().top});
                bookmark[id] = details;
                
                storage.set(bookmark, function() {});
                
                return false;
            }
            else { //Dropped on droppable which is another bookmark so revert
                return true;
            }
           
        }
    });
     $( '.droppable' ).droppable({
        tolerance: 'touch'
    });*/
    
    return 'id-' + id;
};
