$(document).ready(function() {
	
	// Storing the bookmarks and their configuration in Chrome storage
	var storage = chrome.storage.sync;
	
	// Hiding the dialogue for adding/editing bookmarks
	$( '.modal' ).hide();
	
	/** Getting all the data from Chrome storage **/
	storage.get(null, function(items) {
		var allKeys = Object.keys(items);
		console.log(items);
		
		// Loop through the data and render the bookmarks to the page
        allKeys.forEach(function (id, index){
			if (id == 'counter') {return;} // Ignore the counter data
			var bookmark = items[id];
			
			// Render the bookmark
            addLink(id, bookmark.url, bookmark.title, bookmark.image, bookmark.position);
		});
	});
	
	/** The 'Add bookmark' button click handler **/
	$('#addLink').click(function(){
		
		// Ignore if inactive, because e.g. in editing mode
		if (!$(this).hasClass('inactive')) {
			
			/* Prep the form for adding a new bookmark */
			
			// 1. Clean the form from previously rendered/inserted data
			$('.modal, .modal error').hide();
			$('#addLinkModal input').val('');
			
			// 2. Set up the 'add' info
			$('.modal').attr('id', 'addLinkModal');
			$('#addLinkModal header').html('Add a new bookmark');
			$('#addLinkModal a').html('Add');
			
			// Show the dialogue
			$( '#addLinkModal' ).show();
		}
	});
	
	/** The 'Edit bookmark' button click handler **/
	$('#editLinks').click(function(){
		
		// Hide the dialoque (and any displayed errors)
		$('.modal, .modal error').hide();
		
		// Hide the bookmarks toolbar
		$('#editElem').hide();
		
		/* Style the page to show that we are in and out of 'edit' mode */
		
		// 1. Toggle editable bookmark styling
		$('#linkList > div').toggleClass('editable').removeClass('selected');
		
		// 2. Toggle header < - > instructions
		$('#instructions label').toggle();
		
		// 3. (De)activate the 'Add bookmark' button
		$('#addLink').toggleClass('inactive');
		
		// 4.Toggle the 'edit bookmark' button icon edit < - > done
		$(this).find('.icon').toggleClass('icon-pencil, icon-checkmark');
	});
	
	/** When clicking on a bookmark in 'edit' mode **/
	$('#linkList').on('click', '.editable', function (e) {
		
		// Don't follow the link
		e.preventDefault();
		
		// Hide the bookmarks toolbar
		$('#editElem').hide();
		
		var bookmark = $(this);
		
		// 1. Deselect all bookmarks
		$('#linkList > div').removeClass('selected');
		
		// 2. and style the clicked bookmark as selected
		bookmark.addClass('selected');
		
		/* Set the toolbar */
		$('#editElem')
			// 1. Position the toolbar next to the clicked bookmark
			.css('top', bookmark.offset().top)
			.css('left', (bookmark.offset().left + bookmark.width() + 40))
		
			// 2. Add the selected bookmark's ID as data to the toolbar to bind it with its data
			.data('id', bookmark.data('id'));
		
		// 3. Show the toolbar with animation
		$('#editElem').show('slide', {direction: 'left'}, 200);
	});
	
	/** Delete a bookmark **/
	$('#editElem .icon-cross').click(function(){
		
		// Get the ID from the toolbar's data
		var deleteId = $(this).parent().data('id');
		
		// Delete from Ghrome storage and remove from the page
		storage.remove(deleteId.toString(), function(){
			$('#editElem').hide();
			$('#id-' + deleteId).remove();
		});
	});
	
	/** Edit a bookmark **/
	$('#editElem .icon-pencil2').click(function(){
		
		// Get the ID from the toolbar's data
		var editId = $(this).parent().data('id');
		
		// Get the bookmark's info from Chrome storage
		storage.get(editId.toString(), function(data) {
			
			/* Prep the dialogue to edit the bookmark */
			
			// 1. Populate the dialogue with the bookmark's stored info
			$('#editLinkModal #title').val(data[editId].title);
			$('#editLinkModal #url').val(data[editId].url);
			
			// 2. Set up the 'edit' info
			$('.modal').attr('id', 'editLinkModal');
			$('#editLinkModal header').html('Edit the bookmark');
			$('#editLinkModal a').html('Save');
			
			// Show the dialogue
			$( '#editLinkModal' ).show();
		});
	});

	/** Clicking the modal's x button **/
	$('.modal span').click(function(){
		
		// Clean the form
		$('.modal input').val('');
		
		// Hide the dialogue
		$( '.modal' ).hide();
	});
    
	
	/** Adding/Updating a bookmark **/
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
			
			// Regular expression to match a URL
			var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
			
			/* Title is compulsory */
			if ($('.modal #title').val()=='') {
				$('.modal error').html('Please enter a title for your bookmark').css('display','block'); 
				return false;
			}
			
			/* Validate the URL */
			else if (!re.test(details.url)) { 
				$('.modal error').html('Please enter a valid URL').css('display','block'); 
				return false;
			}
			
			// If the URL has not http(s), add http at the beginning
			re = /^(http[s]?:\/\/)/;
			if (!re.test(details.url)) { 
				details.url = 'http://' + details.url;
			}
					
			/* Adding or editing? */
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

/**  adLink is the function that takes the bookmark info and renders it in the page **/

var addLink = function(id, url, title, image, position ) {
	
	// Append a div to the list of bookmarks, adding useful attributes for positioning etc
    $('#linkList').append(
		'<div id="id-' + id + '" data-id="' + id + '" class="draggable droppable"><a href="' + url + '">' + title + '</a></div>'
	);
	
	// If the position is not defined e.g. for a new bookmark, set to (0, 0)
	if (typeof position === "undefined") {
        position = {'top': 0, 'left': 0}; 
    }
	
	// If a favicon was retrieved, add the background image and a class for styling
	if (typeof image !== "undefined") {
        $('#id-' + id)
			.addClass('hasIcon')
			.css({'background-image': 'url(' + image +')'});
    }
	
	// Position the bookmark and add useful data
	$('#id-' + id)
		.css({'top': position.top, 'left': position.left})
		.attr('data-top', position.top)
		.attr('data-left', position.left)
		.data('title', title); 
    
	// Using Jquery UI draggable and droppable for the bookmark divs
    $( '.draggable' ).draggable({
		
		// Don't allow positioning outside the parent container
        containment: 'parent'
        , cursor: 'move'
		
		// Draggable divs are also droppable so I need to revert position when dropped on a droppable
        , revert: function (valid) {
	
            if (!valid) { //Dropped on non-droppable so it's safe to store the new location
                
				// Get the element ID from the data
				var elemId = $(this).data('id');				
				
				/* Set up the new object to store in Chrome's storage, with the updated position */
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
                
				// Update the element's data with the new position
				$('#id-' + elemId)
					.attr('data-top', details.position.top)
					.attr('data-left', details.position.left);
				
				// Store the udpdated info in the storage
                chrome.storage.sync.set(bookmark, function() {});
                
				// Don't revert
                return false;
            }
            else { //Dropped on droppable which is another bookmark so revert
                return true;
            }
           
        }
    });
	
	// Don't let the divs be on top of each other or touch
    $( '.droppable' ).droppable({
        tolerance: 'touch'
    });
    
    return 'id-' + id;
};