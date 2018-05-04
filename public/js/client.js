console.log('Client-side code running');

function remove(recordListId, recordId){
	fetch('/'+recordListId+'/'+recordId, {method: 'DELETE'})
    	.then(function(response) {
		    if(response.ok) {
		        console.log('Click was recorded');
		        return;
	      	}
	      	throw new Error('Request failed.');
    	})
	    .catch(function(error) {
	    	console.log(error);
	});
}