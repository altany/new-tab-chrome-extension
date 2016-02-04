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
		
		console.log(counter, document.location.href);
		/*var details = {
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
		console.log(bookmark);
		storage.set(bookmark, function() {});

		$( '#addLinkModal' ).hide();
		$('#addLinkModal input').val('');

		storage.set({'counter' : counter}, function() {});*/
	}); 
	
	
} 


document.addEventListener('DOMContentLoaded', init);

