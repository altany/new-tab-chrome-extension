$(document).ready(function() {
	var storage = chrome.storage.sync;
	
	$( '.modal' ).hide();
	
	$('#addLink').click(function(){
		if (!$(this).hasClass('inactive')) {
			$('.modal, .modal error').hide()
			$('.modal').attr('id', 'addLinkModal');
			$('#addLinkModal input').val('');
			$('#addLinkModal header').html('Add a new bookmark');
			$('#addLinkModal a').html('Add');
			$( '#addLinkModal' ).show();
		}
	});
	
	$('#editLinks').click(function(){
		$('.modal, .modal error').hide();
		$('#linkList > div').toggleClass('editable').removeClass('selected');
		$('#editElem').hide();
		$('#instructions label').toggle();
		$('#addLink').toggleClass('inactive');
		$(this).find('.icon').toggleClass('icon-pencil, icon-checkmark');
	});
	

	$('#linkList').on('click', '.editable', function (e) {
		$('#editElem').hide();
		e.preventDefault();
		var bookmark = $(this);
		$('#linkList > div').removeClass('selected');
		bookmark.addClass('selected');
		$('#editElem')
			.css('top', bookmark.offset().top)
			.css('left', (bookmark.offset().left + bookmark.width() + 40))
			.data('id', bookmark.data('id'));
		$('#editElem').show('slide', {direction: 'left'}, 200);
	});
	
	$('#editElem .icon-cross').click(function(){
		var deleteId = $(this).parent().data('id');
		storage.remove(deleteId.toString(), function(){
			$('#editElem').hide();
			$('#id-' + deleteId).remove();
		});
	});
	
	$('#editElem .icon-pencil2').click(function(){
		var editId = $(this).parent().data('id');
		storage.get(editId.toString(), function(data) {
			$('.modal').attr('id', 'editLinkModal');
			$('#editLinkModal #title').val(data[editId].title);
			$('#editLinkModal #url').val(data[editId].url);
			$('#editLinkModal header').html('Edit the bookmark');
			$('#editLinkModal a').html('Save');
			$( '#editLinkModal' ).show();
		});
	});

	$('.modal span').click(function(){
		$('.modal input').val('');
		$( '.modal' ).hide();
	});
    
	storage.get(null, function(items) {
		var allKeys = Object.keys(items);
		console.log(items);
        allKeys.forEach(function (id, index){
			if (id == 'counter') {return;}
			var bookmark = items[id];
            addLink(id, bookmark.url, bookmark.title, bookmark.image, bookmark.position);
		});
	});
	
	storage.get('counter', function(data) {
		var counter = 10000;
		if (typeof data['counter'] !== 'undefined'){
			counter = data['counter'];
		}
		
		storage.set({'counter' : counter}, function() {});
		
		$('.modal a').click(function(e){
			e.preventDefault();
			var details = {
				title : $('.modal #title').val(),
				url : $('.modal #url').val()
			};
			details.image = 'http://www.google.com/s2/favicons?domain_url=' + details.url;
			
			var id;
			var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
			if ($('.modal #title').val()=='') {
				$('.modal error').html('Please enter a title for your bookmark').css('display','block'); 
				return false;
			}
			else if (!re.test(details.url)) { 
				$('.modal error').html('Please enter a valid URL').css('display','block'); 
				return false;
			}
			
			if ($('.modal').attr('id') == 'addLinkModal') {
				id = ++counter;
				addLink(counter, details.url, details.title, details.image);
			}
			else if ($('.modal').attr('id') == 'editLinkModal') {
				id = $('#editElem').data('id');
			}
			
            
            details.position = $('#id-'+id).position();
            var bookmark = {};
            bookmark[id] = details;
            storage.set(bookmark, function() {});
			
			if ($('.modal').attr('id') == 'editLinkModal') {
				$('#id-'+id).css('background-image', 'url(' + details.image +')');
				$('#id-'+id+' a')
					.attr('href', details.url)
					.text(details.title);
			}
			
			$( '.modal' ).hide();
			$('.modal input').val('');
			
			storage.set({'counter' : counter}, function() {});
		});
		
	});
	
});

var addLink = function(id, url, title, image, position ) {
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