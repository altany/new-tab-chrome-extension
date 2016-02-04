alert('clicked');

storage.get('counter', function(data) {
    var counter = 10000;
    if (typeof data['counter'] !== 'undefined'){
        counter = data['counter'];
    }

    storage.set({'counter' : counter}, function() {});

    
        var details = {
            title :'test',
            url : document.location.href
        };

        var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
        if (details.title=='') {
            alert('Please enter a title for your bookmark');
            return false;
        }
        
        counter++;		

        addLink(counter, details.url, details.title);

        details.position = { 'top' : 10px, 'left' : 10px};
        var bookmark = {};
        bookmark[counter] = details;
        console.log(bookmark);
        storage.set(bookmark, function() {});

        storage.set({'counter' : counter}, function() {});

});

var addLink = function(id, url, title, position) {
    console.log('adding link', id, title);
    // Draggables are also droppables so I need to revert when it's dropped on a droppable
	$('#linkList').append('<div id="id-' + id + '" data-id="' + id + '" class="draggable droppable"><a href="' + url + '" target="_blank">' + title + '</a></div>');
    if (typeof position !== "undefined") {
        $('#id-' + id).css({'top': position.top, 'left': position.left}); 
    }
    $( '.draggable' ).draggable({
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