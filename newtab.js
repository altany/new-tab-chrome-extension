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
			addLink(id, bookmark.url, bookmark.title);
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
				alert("Please enter a title for your bookmark");
				return false;
			}
			else if (!re.test(details.url)) { 
				alert("Please enter a valid URL");
				return false;
			}
			counter++;
			var bookmark = {};
			bookmark[counter] = details;
			storage.set(bookmark, function() {});
			$( '#addLinkModal' ).hide();
			$('#addLinkModal input').val('');
			addLink(counter, details.url, details.title);
			storage.set({'counter' : counter}, function() {});
		});
		
	});
	
});

var addLink = function(id, url, title) {
	$('#linkList').append('<div id="id-' + id + '"><a href="' + url + '" target="_blank">' + title + '</a></div>');
};