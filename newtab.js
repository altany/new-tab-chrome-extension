$(document).ready(function() {
	var storage = chrome.storage.sync;
	
	$( '#addLinkModal' ).hide();
	
	$('#addLink').click(function(){
		$( '#addLinkModal' ).show();
	});
	
	$('#addLinkModal span').click(function(){
		$('#addLinkModal input').val('');
		$( '#addLinkModal' ).hide();
	});
    
	chrome.storage.sync.get(null, function(items) {
		var allKeys = Object.keys(items);
		console.log(items);
        allKeys.forEach(function (id, index){
			if (id == 'counter') {return;}
			var bookmark = items[id];
            addLink(id, bookmark.url, bookmark.title, bookmark.position, bookmark.image);
		});
	});
	
	storage.get('counter', function(data) {
		var counter = 10000;
		if (typeof data['counter'] !== 'undefined'){
			counter = data['counter'];
		}
		
		storage.set({'counter' : counter}, function() {});
		
		$('#addLinkModal a').click(function(e){
			e.preventDefault();
			var details = {
				title : $('#addLinkModal #title').val(),
				url : $('#addLinkModal #url').val()
			};
			
			var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
			if ($('#addLinkModal #title').val()=='') {
				alert('Please enter a title for your bookmark');
				return false;
			}
			else if (!re.test(details.url)) { 
				alert('Please enter a valid URL');
				return false;
			}
			counter++;		
			            
            addLink(counter, details.url, details.title);
            
            details.position = $('#id-'+counter).position();
            var bookmark = {};
            bookmark[counter] = details;
            storage.set(bookmark, function() {});
            
			$( '#addLinkModal' ).hide();
			$('#addLinkModal input').val('');
			
			storage.set({'counter' : counter}, function() {});
		});
		
	});
	
});

var addLink = function(id, url, title, position, image) {
    // Draggables are also droppables so I need to revert when it's dropped on a droppable
	$('#linkList').append('<div id="id-' + id + '" data-id="' + id + '" class="draggable droppable"><a href="' + url + '" target="_blank">' + title + '</a></div>');
	
	if (typeof position === "undefined") {
        position = {'top': 0, 'left': 0}; 
    }
	if (typeof image !== "undefined") {
        $('#id-' + id)
			.addClass('hasIcon')
			.css({'background-image': 'url(' + image +')'});
    }
	
	$('#id-' + id)
		.css({'top': position.top, 'left': position.left})
		.attr('data-top', position.top)
		.attr('data-left', position.left)
		.data('title', title); 
    
    $( '.draggable' ).draggable({
        containment: 'parent'
        , cursor: 'move'
        , revert: function (valid) {
            if (!valid) { //Dropped on non-droppable so it's safe to store the new location
                var storage = chrome.storage.sync;
				
				var elemId = $(this).data('id');				
				
                // Save new location here
                var bookmark = {};
                var details = {
                    title : $(this).data('title'),
                    url : $(this).find('a').attr('href'),
					position : {'left': $(this).position().left, 'top' : $(this).position().top}
                };
				if ($(this).hasClass('hasIcon')) {
					details.image = $(this).css('background-image').replace('url(','').replace(')','');
				}
                bookmark[elemId] = details;
                console.log();
				$('#id-' + elemId)
					.attr('data-top', details.position.top)
					.attr('data-left', details.position.left);
				
                /* Not updating the right entry */
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
    });
    
    return 'id-' + id;
};